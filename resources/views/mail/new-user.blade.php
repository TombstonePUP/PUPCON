<x-mail::message>
# Greetings, {{ $name }}!

We are excited to inform you that your account has been successfully created. You can now access your account using the credentials below:

**Email:** {{ $email }}  
@if ($password)
**Password:** {{ $password }}  
@endif

<x-mail::button :url="url('/login')" color="primary">
Login to Your Account
</x-mail::button>

If you did not request this account or have any questions, please contact our support team.

Best regards,<br>
PUPCON Administrator
</x-mail::message>
