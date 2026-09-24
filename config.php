<?php
// Set these as environment variables on your hosting server.
// Never put live secret keys directly in GitHub.
function envv(string $key, string $default = ''): string {
    $v = getenv($key);
    return ($v === false || $v === '') ? $default : $v;
}

define('RAZORPAY_KEY_ID', envv('RAZORPAY_KEY_ID'));
define('RAZORPAY_KEY_SECRET', envv('RAZORPAY_KEY_SECRET'));
define('OPENAI_API_KEY', envv('OPENAI_API_KEY'));
define('PALM_PRICE', 15100); // ₹151 in paise
?>
