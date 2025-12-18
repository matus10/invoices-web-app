from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from django_filters.rest_framework import DjangoFilterBackend
from django.utils.timezone import now
from django.db.models import Sum

from ..serializers import InvoiceSerializer
from ..serializers import Invoice
from ..filters import InvoiceFilter
from ..models import Person

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_class = InvoiceFilter

    @action(detail=False, methods=["get"], url_path=r"identification/(?P<ico>\w+)/sales")
    def sales_by_ico(self, request, ico=None):
        persons = Person.objects.filter(identificationNumber=ico)
        invoices = Invoice.objects.filter(seller__in=persons)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path=r"identification/(?P<ico>\w+)/purchases")
    def purchases_by_ico(self, request, ico=None):
        persons = Person.objects.filter(identificationNumber=ico)
        invoices = Invoice.objects.filter(buyer__in=persons)
        serializer = InvoiceSerializer(invoices, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["get"], url_path="statistics")
    def statistics(self, request):
        queryset = self.get_queryset()
        current_year = now().year

        current_year_sum = (queryset.filter(issued__year=current_year).aggregate(total=Sum("price"))["total"] or 0
        )

        all_time_sum = (
            queryset.aggregate(total=Sum("price"))["total"] or 0
        )

        invoices_count = queryset.count()

        return Response({
            "currentYearSum": current_year_sum,
            "allTimeSum": all_time_sum,
            "invoicesCount": invoices_count,
        })
