from django.http import JsonResponse
from django.views import View

# Create your views here.


class Test(View):

    def get(self, request):
        data = {'boss': 'Sigve'}
        return JsonResponse(data=data)
