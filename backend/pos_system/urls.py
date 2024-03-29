from django.urls import path, include
from .views import (InventoryViewSet, MenuItemViewSet, CustomerViewSet, EmployeeViewSet,
                    RecipeViewSet, CustomerOrderViewSet, OrderItemsViewSet, register_user,
                    login_employee, GroupedMenuItemsView)

from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'inventory', InventoryViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'customers', CustomerViewSet)
router.register(r'employees', EmployeeViewSet)
router.register(r'recipes', RecipeViewSet)
router.register(r'customer-orders', CustomerOrderViewSet)
router.register(r'order-items', OrderItemsViewSet)


urlpatterns = [
    path('', include(router.urls)),
    path('register/', register_user, name='register'),
    path('login/', login_employee, name='login'),

    # custom views
    path('grouped-menu-items/', GroupedMenuItemsView.as_view(), name='grouped-menu-items'),

]


