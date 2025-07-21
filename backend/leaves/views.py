from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from datetime import date
from datetime import timedelta
from rest_framework.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User, Group
from rest_framework.serializers import ModelSerializer
from rest_framework import status
from .serializers import UserProfileSerializer
from rest_framework import generics, permissions
from .models import Leave, LeaveBalance
from .serializers import LeaveSerializer, LeaveBalanceSerializer
from rest_framework.permissions import AllowAny
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework.decorators import api_view, permission_classes

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def employee_list(request):
    employee_group = Group.objects.get(name='Employee')
    employees = employee_group.user_set.all()
    data = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        }
        for user in employees
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def total_employees(request):
    try:
        employee_group = Group.objects.get(name='Employee')
        employee_count = employee_group.user_set.count()
        return Response({'total_employees': employee_count})
    except Group.DoesNotExist:
        return Response({'total_employees': 0})


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    user = request.user
    groups = [group.name for group in user.groups.all()]
    return Response({
        'username': user.username,
        'groups': groups
    })

class LeaveRequestListCreateView(generics.ListCreateAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Leave.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)




class LeaveBalanceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        balances = LeaveBalance.objects.filter(user=user)

        leave_entitlements = {
            'Maternity Leave': 114,
            'Sick Leave': 44,
            'Vacation Leave': 23,
        }

        summary = []

        for balance in balances:
            leave_type = balance.leave_type

            approved_leaves = Leave.objects.filter(
                user=user,
                leave_type=leave_type,
                status='Approved'
            )

            total_weekdays_used = 0

            for leave in approved_leaves:
                start = leave.start_date
                end = leave.end_date
                current_day = start
                while current_day <= end:
                    if current_day.weekday() < 5:  
                        total_weekdays_used += 1
                    current_day += timedelta(days=1)

            total_earned = leave_entitlements.get(leave_type, 0)
            remaining_balance = total_earned - total_weekdays_used

            summary.append({
                'leave_type': leave_type,
                'total_earned': total_earned,
                'used': total_weekdays_used,
                'balance': remaining_balance
            })

        return Response(summary)


class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        groups = [group.name for group in user.groups.all()]
        return Response({
            "username": user.username,
            'first_name': user.first_name,
            "email": user.email,
            "groups": groups,
        })
    
class AllLeaveRequestsForManagers(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        if not request.user.is_staff:
            return Response({"detail": "Not authorized."}, status=403)

        leaves = Leave.objects.all().order_by('-created_at')
        serializer = LeaveSerializer(leaves, many=True)
        return Response(serializer.data)


class LeaveUpdateView(RetrieveUpdateDestroyAPIView):
    queryset = Leave.objects.all()
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        old_instance = self.get_object()
        prev_status = old_instance.status
        instance = serializer.save()

        if prev_status != "Approved" and instance.status == "Approved":
            user = instance.user
            leave_type = instance.leave_type
            days_requested = (instance.end_date - instance.start_date).days + 1

            balance, created = LeaveBalance.objects.get_or_create(
                user=user,
                leave_type=leave_type,
                defaults={'remaining_balance': 10}
            )

            if balance.remaining_balance < days_requested:
                raise ValidationError(f"Not enough leave balance for {leave_type}. Available: {balance.remaining_balance}, Requested: {days_requested}")

            balance.remaining_balance -= days_requested
            balance.save()

class MyLeaveRequestsView(generics.ListAPIView):
    serializer_class = LeaveSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Leave.objects.filter(user=self.request.user).order_by('-created_at')
    
class UserCreateSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

@api_view(['POST'])
@permission_classes([IsAdminUser])  
def create_user(request):
    serializer = UserCreateSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        user.set_password(request.data['password'])  
        user.save()

        role = request.data.get('role')
        if role in ['Manager', 'Employee']:
            group, _ = Group.objects.get_or_create(name=role)
            user.groups.add(group)

        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        serializer = UserProfileSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


