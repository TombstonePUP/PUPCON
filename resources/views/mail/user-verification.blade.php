<x-mail::message>
# OTP Verification
Please use the following One-Time Password (OTP) to verify your account:

**OTP:** {{ $otp }}

This OTP is valid for the next 60 seconds. If you did not request this, please ignore this email.

Best Regards,<br>
PUPCON Administrator
{{ config('app.name') }}
</x-mail::message>
