from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'inventory', views.InventoryViewSet)
router.register(r'menu-items', views.MenuItemViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'recipes', views.RecipeViewSet)
router.register(r'customer-orders', views.CustomerOrderViewSet)
router.register(r'order-items', views.OrderItemsViewSet)

manager_view = [
    path('best-selling-combo/', views.best_selling_combo, name='best-selling-combo'),
    path('sales-trend/', views.sales_trend, name='sales-trend'),
    path('inventory-usage/', views.inventory_usage, name='inventory-usage'),
    path('orders-per-day/', views.OrdersPerDayView.as_view(), name='orders-per-day'),
    path('inventory/', views.get_inventory, name='inventory'),
    path('excess-report/', views.excess_report, name='excess-report'),
]

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.register_user, name='register'),
    path('login/', views.login_employee, name='login'),
    path('exchange-token/', views.google_token_exchange, name='exchange_token'),

    # path('auth/google/callback/', views.google_callback, name='google_callback'),

    # custom views
    path('grouped-menu-items/', views.GroupedMenuItemsView.as_view(), name='grouped-menu-items'),

    path('create-order/', views.create_order, name='create_order'),

    path('manager-view/', include(manager_view)),

    path('get-weather/', views.get_weather, name='get_weather'),

    path('update-order-status/', views.update_order_status, name='update-order-status'),
    path('orders-in-progress/', views.get_in_progress_orders),
]


