export const verificationEmailTemplete=`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Booking - Email Verification</title>
    <style>
        /* Global Styles */
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f7fc;
        }

        .container {
            width: 100%;
            padding: 20px;
            background-color: #f4f7fc;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .email-content {
            width: 100%;
            max-width: 650px;
            background-color: #ffffff;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        /* Header Styles */
        .header {
            margin-bottom: 30px;
        }

        .header img {
            width: 180px;
            margin-bottom: 20px;
        }

        .header h1 {
            font-size: 30px;
            color: #007bff;
            font-weight: bold;
            margin-bottom: 10px;
        }

        /* Main Message Styles */
        .message {
            font-size: 16px;
            color: #333;
            line-height: 1.6;
            margin-bottom: 30px;
            padding: 0 20px;
        }

        .message p {
            margin: 10px 0;
        }

        /* Button Styles */
        .cta-button {
            display: inline-block;
            padding: 16px 40px;
            background: linear-gradient(135deg, #007bff, #00c6ff);
            color: #ffffff;
            text-decoration: none;
            font-size: 18px;
            font-weight: bold;
            border-radius: 50px;
            transition: background 0.3s ease, transform 0.3s ease;
            margin-top: 20px;
        }

        .cta-button:hover {
            background: linear-gradient(135deg, #0056b3, #0098db);
            transform: translateY(-4px);
        }

        /* Footer Styles */
        .footer {
            margin-top: 40px;
            font-size: 14px;
            color: #888;
        }

        .footer p {
            margin: 10px 0;
        }

        .footer a {
            color: #007bff;
            text-decoration: none;
            transition: color 0.3s ease;
        }

        .footer a:hover {
            color: #0056b3;
        }

        /* Media Query for Mobile */
        @media (max-width: 600px) {
            .email-content {
                padding: 20px;
            }

            .cta-button {
                padding: 12px 30px;
                font-size: 16px;
            }

            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="email-content">
            <div class="header">
                <img src="https://example.com/logo.png" alt="Hotel Logo">
                <h1>Welcome to Royal Haven</h1>
            </div>
            <div class="message">
                <p>Hi [Guest Name],</p>
                <p>Thank you for booking with Royal Haven! We need you to verify your email address before we can finalize your booking.</p>
                <p>Please click the button below to complete your email verification:</p>
                <a href="[Verification Link]" class="cta-button">Verify My Email</a>
                <p>If you didn’t make this request, simply ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2025 Royal Haven. All rights reserved.</p>
                <p><a href="https://example.com/privacy-policy" target="_blank">Privacy Policy</a> | <a href="https://example.com/terms" target="_blank">Terms & Conditions</a></p>
            </div>
        </div>
    </div>
</body>
</html>
`