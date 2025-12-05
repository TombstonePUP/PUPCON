@extends('errors::minimal')

@section('title', __('Not Found'))
@section('code', '404')
@section('message')
    {{ $message ?? __('The page you\'re looking for cannot be found.') }}
@endsection

@section('content')
<div class="error-page">
    <div class="content">
        
        <div class="construction-container">
            <div class="icon">
                <svg class="icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h3 class="title">{{ $code ?? '404' }} {{ $title ?? __('Not Found') }}</h3>
            <p class="description">{{ $message ?? __('The page you\'re looking for cannot be found.') }}</p>
            <a href="{{ url('/') }}" class="btn-back">Go Back Home</a>
        </div>

    </div>
</div>
@endsection
