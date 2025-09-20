<x-mail::message>
# Grettings, {{ $name }}!

Your account has been created. Please click the button below access your account.<br>
Here are your credentials:

Email: {{ $email }} <br>
@if ($password)
    Password: {{ $password }} <br>
@endif

@component('mail::button', ['url' => url('/login')])
Login
@endcomponent

Yours Truly,<br>
{{ config('app.name') }}
</x-mail::message>
