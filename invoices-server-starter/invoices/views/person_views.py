from rest_framework import viewsets, status
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.decorators import action
from ..serializers import PersonSerializer
from ..serializers import Person
from ..filters import PersonFilter
from django.db.models import Sum
from ..models import Invoice


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.filter(hidden=False)
    serializer_class = PersonSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = PersonFilter

    def update(self, request, *args, **kwargs):
        instance = self.get_object()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        instance.hidden = True
        instance.save(update_fields=["hidden"])

        validated_data = serializer.validated_data
        validated_data.pop('hidden', None)
        new_instance = Person.objects.create(**validated_data, hidden=False)

        output_serializer = self.get_serializer(new_instance)
        return Response(output_serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.hidden = True
        instance.save(update_fields=["hidden"])
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    @action(detail=False, methods=["get"], url_path="statistics")
    def statistics(self, request):
        persons = self.get_queryset()

        min_revenue = request.GET.get("minRevenue")
        max_revenue = request.GET.get("maxRevenue")

        results = []

        for person in persons:
            revenue = Invoice.objects.filter(seller=person).aggregate(total=Sum("price"))["total"] or 0

            if min_revenue is not None and revenue < float(min_revenue):
                continue

            if max_revenue is not None and revenue > float(max_revenue):
                continue

            results.append({
                "personId": person.id,
                "personName": person.name,
                "revenue": revenue
            })

        return Response(results)
