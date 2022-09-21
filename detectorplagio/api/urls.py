from django.urls import path
from .views import CalculateSimilarity, GeneratePDF, CleanFiles, Example01, Example02, GeneratePDFEmailError

urlpatterns = [
    path('calculate-similarity', CalculateSimilarity.as_view()),
    path('example01', Example01.as_view()),
    path('example02', Example02.as_view()),
    path('generate-pdf', GeneratePDF.as_view()),
    path('generate-pdf-error', GeneratePDFEmailError.as_view()),
    path('clean-files', CleanFiles.as_view()),
]
