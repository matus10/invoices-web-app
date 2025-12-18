from django.urls import path, include
from .routers import SlashOptionalRouter

from .views.person_views import PersonViewSet
from .views.invoice_views import InvoiceViewSet

router = SlashOptionalRouter()
router.register(r'persons', PersonViewSet)
router.register(r'invoices', InvoiceViewSet)


urlpatterns = [
    path('api/', include(router.urls)), #Endpoint 
    path('api/identification/<str:ico>/sales', InvoiceViewSet.as_view({"get": "sales_by_ico"}), name='invoice-sales-by-ico'), #Endpoint pro /identification/<ico>/sales
    path('api/identification/<str:ico>/purchases', InvoiceViewSet.as_view({"get": "purchases_by_ico"}), name='invoice-purchases-by-ico') #Endpoint pro /identification/<ico>/purchases
]
