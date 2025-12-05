<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale: 1.0">
    <title>Welcome to PUPCON</title>
    <style>
        /* Base styles */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f4f4f7; }
        p {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #333333;
            margin: 0 0 15px 0;
        }
        .text-slate-600 { color: #475569; }
        .text-slate-900 { color: #0f172a; }

        /* Main container */
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
        }
        
        /* Header (Matches your app's header icon/color) */
        .header {
            background-color: #7f1414; /* Your Brand Color */
            padding: 24px 32px;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            margin: 0;
            font-family: Arial, sans-serif;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
        }
        .header p {
            margin: 4px 0 0 0;
            font-size: 14px;
            color: #f9f2f2; /* Light accent */
        }

        /* Main content card (Matches your app's content area) */
        .card {
            background-color: #ffffff;
            border-radius: 0 0 8px 8px;
            border-left: 1px solid #e0e0e0;
            border-right: 1px solid #e0e0e0;
            border-bottom: 1px solid #e0e0e0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            padding: 32px 40px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 20px;
        }

        /* --- CREDENTIALS STYLE --- */
        /* Mimics your UI's "Label" */
        .form-field-label {
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #475569; /* slate-600 */
            font-weight: 500;
            margin-bottom: 8px;
            display: block;
        }
        /* Mimics your UI's "Input Field" */
        .form-field-value {
            background-color: #f8fafc; /* slate-50 */
            border: 1px solid #e2e8f0; /* slate-200 */
            border-radius: 8px; /* rounded-lg */
            padding: 12px 16px;
            font-family: Arial, sans-serif;
            font-weight: 500;
            font-size: 16px;
            color: #0f172a; /* slate-900 */
            margin: 0;
        }
        /* --- END STYLES --- */

        /* Button (Matches your app's primary button) */
        .button-container {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background-color: #7f1414; /* Your Brand Color */
            color: #ffffff;
            font-family: Arial, sans-serif;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 5px;
        }
        
        /* Footer */
        .footer-text {
            padding-top: 20px;
            border-top: 1px solid #e2e8f0; /* slate-200 */
            font-size: 14px;
            color: #475569;
        }
        .signature {
            padding-top: 16px;
        }

        /* --- NEW FOOTER STYLES --- */
        .email-footer {
            text-align: center;
            font-family: Arial, sans-serif;
            font-size: 14px;
            color: #777777; /* Slightly darker gray */
            padding: 30px 20px;
        }
        .footer-link {
            color: #7f1414; /* Your Brand Color */
            font-weight: bold;
            text-decoration: none;
            margin: 0 8px;
            font-size: 13px;
        }
        .footer-divider {
            border-top: 1px solid #e2e8f0; /* slate-200 */
        }
        /* --- END NEW FOOTER STYLES --- */

    </style>
</head>
<body style="background-color: #f4f4f7; margin: 0; padding: 0;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" class="container">
                    
                    <tr>
                        <td align="left" class="header">
                            <h1>PUPCON</h1>
                            <p>Account Credentials</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td align="left" class="card">
                            
                            <p class."greeting" style="font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 20px; font-family: Arial, sans-serif;">
                                Greetings, {{ $name }}!
                            </p>
                            
                            <p class="text-slate-600" style="color: #475569; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                                We are excited to inform you that your account has been successfully created. You can now access your account using the credentials below:
                            </p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 25px 0;">
                                <tr>
                                    <td style="padding-bottom: 20px;">
                                        <label class="form-field-label" style="font-family: Arial, sans-serif; font-size: 14px; color: #475569; font-weight: 500; margin-bottom: 8px; display: block;">Email</label>
                                        <p class="form-field-value" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-family: Arial, sans-serif; font-weight: 500; font-size: 16px; color: #0f172a; margin: 0;">
                                            {{ $email }}
                                        </p>
                                    </td>
                                </tr>
                                
                                @if ($password)
                                <tr>
                                    <td>
                                        <label class="form-field-label" style="font-family: Arial, sans-serif; font-size: 14px; color: #475569; font-weight: 500; margin-bottom: 8px; display: block;">Temporary Password</label>
                                        <p class="form-field-value" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 16px; font-family: Arial, sans-serif; font-weight: 500; font-size: 16px; color: #0f172a; margin: 0;">
                                            {{ $password }}
                                        </p>
                                    </td>
                                </tr>
                                @endif
                            </table>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" class="button-container">
                                <tr>
                                    <td align="center">
                                        <a href="{{ url('/login') }}" target="_blank" class="button" style="color: #ffffff; background-color: #7f1414; text-decoration: none; padding: 14px 28px; border-radius: 5px; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold;">
                                            Login to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p class="footer-text" style="padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 14px; color: #475569; font-family: Arial, sans-serif; line-height: 1.6; margin: 0 0 15px 0;">
                                If you did not request this account or have any questions, please contact our support team.
                            </p>
                            
                            <div class="signature" style="padding-top: 16px;">
                                <p class="text-slate-600" style="margin: 0 0 4px 0; color: #475569; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">Best regards,</p>
                                <p class="text-slate-900" style="margin: 0; font-weight: 500; color: #0f172a; font-family: Arial, sans-serif; font-size: 16px; line-height: 1.6;">PUPCON Administrator</p>
                            </div>
                            
                        </td>
                    </tr>
                    
                    <tr>
                        <td class="email-footer" style="text-align: center; font-family: Arial, sans-serif; font-size: 14px; color: #777777; padding: 30px 20px;">
                            
                            <p style="margin: 0 0 5px 0; font-size: 14px; color: #777777;">© {{ date('Y') }} PUPCON</p>
                            <p style="margin: 0 0 15px 0; font-size: 14px; color: #777777;">Polytechnic University of the Philippines</p>
                            
                            <p style="margin: 0 0 20px 0; font-size: 12px; color: #999999;">
                                This is an automated message. Please do not reply to this email.
                            </p>
                            
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 20px;">
                                <tr>
                                    <td class="footer-divider" style="border-top: 1px solid #e2e8f0;"></td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0;">
                                <a href="#" target="_blank" class="footer-link" style="color: #7f1414; font-weight: bold; text-decoration: none; margin: 0 8px; font-size: 13px;">
                                    Help Center
                                </a>
                                <span style="color: #aaaaaa; font-size: 12px;">&bull;</span>
                                <a href="#" target="_blank" class="footer-link" style="color: #7f1414; font-weight: bold; text-decoration: none; margin: 0 8px; font-size: 13px;">
                                    Privacy Policy
                                </a>
                                <span style="color: #aaaaaa; font-size: 12px;">&bull;</span>
                                <a href="#" target="_blank" class="footer-link" style="color: #7f1414; font-weight: bold; text-decoration: none; margin: 0 8px; font-size: 13px;">
                                    Terms of Service
                                </a>
                            </p>
                            
                        </td>
                    </tr>
                    </table>
            </td>
        </tr>
    </table>
</body>
</html>