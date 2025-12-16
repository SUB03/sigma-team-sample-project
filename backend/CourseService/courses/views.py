from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import Course
from .serializers import CourseSerializer


class CourseListAPIView(APIView):
    """API endpoint для получения списка всех курсов"""
    
    def get(self, request):
        """Получить список всех курсов с фильтрацией"""
        courses = Course.objects.all()
        
        # Фильтры
        search_query = request.query_params.get('search')

        difficulty = request.query_params.get('difficulty')
        min_price = request.query_params.get('min_price')
        max_price = request.query_params.get('max_price')
        is_limited = request.query_params.get('is_limited')
        categories = request.query_params.get('categories')
        if categories:
            courses = courses.filter(category__in=categories.split(','))
        if search_query:
            courses = courses.filter(
                Q(title__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__icontains=search_query)
            )
        if difficulty:
            courses = courses.filter(difficulty_level=difficulty)
        if min_price:
            courses = courses.filter(price__gte=min_price)
        if max_price:
            courses = courses.filter(price__lte=max_price)
        if is_limited is not None:
            courses = courses.filter(is_limited=is_limited.lower() == 'true')
        
        # Сортировка
        sort_by = request.query_params.get('sort_by', '-created_at')
        courses = courses.order_by(sort_by)
        
        serializer = CourseSerializer(courses, many=True)
        
        return Response(
            {
                'count': courses.count(),
                'courses': serializer.data
            },
            status=status.HTTP_200_OK
        )


class CourseDetailAPIView(APIView):
    """API endpoint для получения детальной информации о курсе"""
    
    def get(self, request, course_id):
        """Получить информацию о конкретном курсе"""
        course = get_object_or_404(Course, id=course_id)
        serializer = CourseSerializer(course)
        
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseCreateAPIView(APIView):
    """API endpoint для создания нового курса (только для админов)"""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        """Создать новый курс"""
        serializer = CourseSerializer(data=request.data)
        
        if serializer.is_valid():
            course = serializer.save()
            
            return Response(
                {
                    'message': 'Курс успешно создан',
                    'course': CourseSerializer(course).data
                },
                status=status.HTTP_201_CREATED
            )
        
        return Response(
            {
                'error': 'Ошибка валидации данных',
                'details': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class CourseUpdateAPIView(APIView):
    """API endpoint для обновления курса (только для админов)"""
    permission_classes = [IsAuthenticated]
    
    def put(self, request, course_id):
        """Полное обновление курса"""
        course = get_object_or_404(Course, id=course_id)
        serializer = CourseSerializer(course, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(
                {
                    'message': 'Курс успешно обновлен',
                    'course': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'error': 'Ошибка валидации данных',
                'details': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    
    def patch(self, request, course_id):
        """Частичное обновление курса"""
        course = get_object_or_404(Course, id=course_id)
        serializer = CourseSerializer(course, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            
            return Response(
                {
                    'message': 'Курс успешно обновлен',
                    'course': serializer.data
                },
                status=status.HTTP_200_OK
            )
        
        return Response(
            {
                'error': 'Ошибка валидации данных',
                'details': serializer.errors
            },
            status=status.HTTP_400_BAD_REQUEST
        )


class CourseDeleteAPIView(APIView):
    """API endpoint для удаления курса (только для админов)"""
    permission_classes = [IsAuthenticated]
    
    def delete(self, request, course_id):
        """Удалить курс"""
        course = get_object_or_404(Course, id=course_id)
        course_title = course.title
        course.delete()
        
        return Response(
            {
                'message': f'Курс "{course_title}" успешно удален'
            },
            status=status.HTTP_200_OK
        )


class PopularCoursesAPIView(APIView):
    """API endpoint для получения популярных курсов"""
    
    def get(self, request):
        """Получить топ популярных курсов"""
        limit = int(request.query_params.get('limit', 5))
        courses = Course.objects.order_by('-popularity')[:limit]
        serializer = CourseSerializer(courses, many=True)
        
        return Response(
            {
                'count': courses.count(),
                'courses': serializer.data
            },
            status=status.HTTP_200_OK
        )

class CoursesCategoriesAPIView(APIView):
    """API endpoint для получения списка категорий курсов"""
    
    def get(self, request):
        """Получить список всех категорий курсов"""
        categories = Course.objects.values_list('category', flat=True).distinct()
        
        return Response(
            {
                'count': len(categories),
                'categories': categories
            },
            status=status.HTTP_200_OK
        )