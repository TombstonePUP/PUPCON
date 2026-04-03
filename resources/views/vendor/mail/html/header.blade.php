@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
<table cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
    <tr>
        <td style="padding: 10px; text-align: center;">
            <img src="{{ config('app.url') }}/images/pupcon-logo-white.png" class="logo" alt="PUPCON Logo" style="height: 60px; width: auto; display: block; margin: 0 auto;">
        </td>
    </tr>
    <tr>
        <td style="text-align: center; padding: 0 10px 10px;">
            <div style="font-size: 20px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">PUPCON</div>
            <div style="font-size: 12px; color: rgba(255, 255, 255, 0.85); font-weight: 500;">PUP San Juan Accreditation System</div>
        </td>
    </tr>
</table>
</a>
</td>
</tr>
