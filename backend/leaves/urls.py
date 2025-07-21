from django.urls import path
from .views import (
    LeaveRequestListCreateView,
    CurrentUserView,
    AllLeaveRequestsForManagers,
    MyLeaveRequestsView, 
    LeaveBalanceView,
    UserProfileView,
    total_employees,
    employee_list,
    create_user,
)

urlpatterns = [
    path('', LeaveRequestListCreateView.as_view(), name='leave-list-create'),
    path('user/', CurrentUserView.as_view(), name='current_user'),
    path('all/', AllLeaveRequestsForManagers.as_view(), name='all-leave-requests'),
    path('my-requests/', MyLeaveRequestsView.as_view(), name='my-leave-requests'),
    path('leave-balance/', LeaveBalanceView.as_view(), name='leave-balance'),
    path('employees/count/', total_employees, name='total-employees'),
    path('employees/', employee_list, name='employee-list'),
    path('employees/create/', create_user, name='create-user'),
    path('user/profile/', UserProfileView.as_view(), name='user-profile'),
]
