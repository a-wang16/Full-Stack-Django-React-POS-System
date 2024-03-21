from django.urls import path, include
from .views import InventoryViewSet, MenuItemViewSet, CustomerViewSet, EmployeeViewSet, RecipeViewSet, CustomerOrderViewSet, OrderItemsViewSet

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
]


