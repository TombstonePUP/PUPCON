<tr>
<td>
<table class="footer" align="center" width="570" cellpadding="0" cellspacing="0" role="presentation">
<tr>
<td class="content-cell" align="center">
<p style="margin-bottom: 8px; color: #718096; font-size: 12px;">
    © {{ date('Y') }} PUPCON - Polytechnic University of the Philippines San Juan
</p>
<p style="margin-bottom: 8px; color: #b0adc5; font-size: 11px;">
    Pinaglabanan St., San Juan City, Metro Manila
</p>
<p style="margin: 0; color: #b0adc5; font-size: 11px;">
    Email: <a href="mailto:sanjuan@pup.edu.ph" style="color: #7f1414;">sanjuan@pup.edu.ph</a>
</p>
{{ Illuminate\Mail\Markdown::parse($slot) }}
</td>
</tr>
</table>
</td>
</tr>
