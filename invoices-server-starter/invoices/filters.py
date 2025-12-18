import django_filters
from django.db.models import Q
from .models import Invoice

class InvoiceFilter(django_filters.FilterSet):

    price = django_filters.NumberFilter(field_name="price")
    minPrice = django_filters.NumberFilter(field_name="price", lookup_expr="gte")
    maxPrice = django_filters.NumberFilter(field_name="price", lookup_expr="lte")

    issued = django_filters.DateFilter(field_name="issued")
    minIssuedDate = django_filters.DateFilter(field_name="issued", lookup_expr="gte")
    maxIssuedDate = django_filters.DateFilter(field_name="issued", lookup_expr="lte")

    dueDate = django_filters.DateFilter(field_name="dueDate")
    minDueDate = django_filters.DateFilter(field_name="dueDate", lookup_expr="gte")
    maxDueDate = django_filters.DateFilter(field_name="dueDate", lookup_expr="lte")

    search = django_filters.CharFilter(method="filter_global")
    limit = django_filters.NumberFilter(method='filter_limit')

    class Meta:
        model = Invoice
        fields = [
            "invoiceNumber",
            "price",
            "issued",
            "dueDate",
            "seller",
            "buyer",
        ]
            
    def filter_limit(self, queryset, name, value):
        try:
            value = int(value)
        except ValueError:
            return queryset
        
        if value > 0:
            return queryset[:value]
        return queryset
    
    def filter_global(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(invoiceNumber__icontains=value) |
            Q(product__icontains=value) |
            Q(note__icontains=value) |
            Q(seller__name__icontains=value) |
            Q(seller__identificationNumber__icontains=value) |
            Q(seller__taxNumber__icontains=value) |
            Q(seller__city__icontains=value) |
            Q(seller__mail__icontains=value) |
            Q(seller__street__icontains=value) |
            Q(seller__telephone__icontains=value) |
            Q(buyer__name__icontains=value) |
            Q(buyer__identificationNumber__icontains=value) |
            Q(buyer__taxNumber__icontains=value) |
            Q(buyer__city__icontains=value) |
            Q(buyer__mail__icontains=value) |
            Q(buyer__street__icontains=value) |
            Q(buyer__telephone__icontains=value) 
        )
    
class PersonFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(method="filter_person")
    limit = django_filters.NumberFilter(method='filter_limit')

    def filter_person(self, queryset, name, value):
        if not value:
            return queryset
        
        return queryset.filter(
            Q(name__icontains=value) |
            Q(identificationNumber__icontains=value) |
            Q(taxNumber__icontains=value) | 
            Q(city__icontains=value) |
            Q(street__icontains=value) |
            Q(zip__icontains=value) |
            Q(country__icontains=value) |
            Q(mail__icontains=value) |
            Q(iban__icontains=value) |
            Q(bankCode__icontains=value) |
            Q(telephone__icontains=value) 
        )
    
    def filter_limit(self, queryset, name, value):
        try:
            value = int(value)
        except ValueError:
            return queryset
        
        if value > 0:
            return queryset[:value]
        return queryset
    
