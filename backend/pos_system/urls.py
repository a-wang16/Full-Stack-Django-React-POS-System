from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'inventory', views.InventoryViewSet)
router.register(r'menu-items', views.MenuItemViewSet)
router.register(r'customers', views.CustomerViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'recipes', views.RecipeViewSet)
router.register(r'customer-orders', views.CustomerOrderViewSet)
router.register(r'order-items', views.OrderItemsViewSet)

manager_view = [
    path('best-selling-combo/', views.best_selling_combo, name='best-selling-combo'),
    path('sales-trend/', views.sales_trend, name='sales-trend'),
    path('inventory-usage/', views.inventory_usage, name='inventory-usage'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_employee, name='login'),

    # custom views
    path('grouped-menu-items/', views.GroupedMenuItemsView.as_view(), name='grouped-menu-items'),

    path('create-order/', views.create_order_example, name='create_order'),
    path('orders-per-day/', views.OrdersPerDayView.as_view(), name='orders-per-day'),

    path('manager-view/', include(manager_view)),

]


