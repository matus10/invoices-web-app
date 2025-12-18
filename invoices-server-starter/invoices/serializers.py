from rest_framework import serializers
from .models import Person, Invoice

class PersonSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    identificationNumber = serializers.CharField(default=None)

    class Meta:
        model = Person
        fields = [
            'name', 'identificationNumber', 'taxNumber', 'accountNumber',
            'bankCode', 'iban', 'telephone', 'mail', 'street', 'zip',
            'city', 'country', 'note', '_id'
        ]

class InvoicePersonField(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, data):
        if isinstance(data, dict):
            data = data.get("_id")
        return super().to_internal_value(data)

class InvoiceSerializer(serializers.ModelSerializer):
    _id = serializers.IntegerField(source="id", read_only=True)
    buyer = InvoicePersonField(queryset=Person.objects.filter(hidden=False))
    seller = InvoicePersonField(queryset=Person.objects.filter(hidden=False))

    class Meta:
        model = Invoice
        fields = [
            'invoiceNumber', 'seller', 'buyer', 'issued', 'dueDate',
            'product', 'price', 'vat', 'note', '_id',
        ]

    def to_representation(self, instance):
        data = super().to_representation(instance)

        data['seller'] = PersonSerializer(instance.seller).data
        data['buyer'] = PersonSerializer(instance.buyer).data

        return data
