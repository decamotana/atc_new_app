<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
<div style="margin: 0px">
    Hi {{$full_name}},
    <br/><br/>
    A new reply has been added. Please login to your {{ env('APP_NAME') }} portal to view and respond
    <br/>
    <br/>
    Message Preview:
    {!! $response !!} ... <a href="{{$button_link}}">Click Here To View The Full Response >> </a>
     
    <br><br><br>
    <table cellpadding="0" cellspacing="0" class="sc-gPEVay eQYmiW" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
        <tbody>
            <tr>
                <td>
                    <table cellpadding="0" cellspacing="0" class="sc-gPEVay eQYmiW" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                        <tbody>
                            <tr>
                                <td style="vertical-align: middle;">    
                                    <h3 color="#000000" class="sc-fBuWsC eeihxG" style="margin: 0px; font-size: 18px; color: rgb(0, 0, 0);">
                                        {{$send_by}}
                                    </h3>
                                    <p color="#000000" font-size="medium" class="sc-dVhcbM fghLuF" style="margin: 0px; font-weight: 500; color: rgb(0, 0, 0); font-size: 14px; line-height: 22px;">
                                        <span>{{ env('APP_NAME') }}</span>
                                    </p>
                                </td>
                                <td width="30">
                                    <div style="width: 30px;">
                                    </div>
                                </td>
                                <td color="#2687c0" direction="vertical" width="1" class="sc-jhAzac hmXDXQ" style="width: 1px; border-bottom: none; border-left: 1px solid rgb(38, 135, 192);">
                                </td>
                                <td width="30">
                                    <div style="width: 30px;">
                                    </div>
                                </td>
                                <td style="vertical-align: middle;">
                                    <table cellpadding="0" cellspacing="0" class="sc-gPEVay eQYmiW" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                        <tbody>
                                            <tr height="25" style="vertical-align: middle;">
                                                <td width="30" style="vertical-align: middle;">
                                                    <table cellpadding="0" cellspacing="0" class="sc-gPEVay eQYmiW" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="vertical-align: bottom;">
                                                                    <span color="#2687c0" width="11" class="sc-jlyJG bbyJzT" style="display: block; background-color:transparent;">
                                                                        <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/phone-icon-2x.png" color="#2687c0" width="13" class="sc-iRbamj blSEcj" style="display: block; background-color: rgb(38, 135, 192);">
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            
                                                <td style="padding: 0px; color: rgb(0, 0, 0);"><a href="tel:{{$phone_number}}" color="#000000" class="sc-gipzik iyhjGb" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
                                                    <span>{{$phone_number}}</span>
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr height="25" style="vertical-align: middle;">
                                                <td width="30" style="vertical-align: middle;">
                                                    <table cellpadding="0" cellspacing="0" class="sc-gPEVay eQYmiW" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="vertical-align: bottom;">
                                                                    <span color="#2687c0" width="11" class="sc-jlyJG bbyJzT" style="display: block; background-color: transparent;">
                                                                        <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/email-icon-2x.png" color="#2687c0" width="13" class="sc-iRbamj blSEcj" style="display: block; background-color: rgb(38, 135, 192);">
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td style="padding: 0px;">
                                                    <a href="mailto:{{$send_by_email}}" color="#000000" class="sc-gipzik iyhjGb" style="text-decoration: none; color: rgb(0, 0, 0); font-size: 12px;">
                                                        <span>{{$send_by_email}}</span>
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr height="25" style="vertical-align: middle;">
                                                <td width="30" style="vertical-align: middle;">
                                                    <table cellpadding="0" cellspacing="0" class="sc-gPEVay eQYmiW" style="vertical-align: -webkit-baseline-middle; font-size: medium; font-family: Arial;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="vertical-align: bottom;">
                                                                    <span color="#2687c0" width="11" class="sc-jlyJG bbyJzT" style="display: block; background-color: transparent;">
                                                                        <img src="https://cdn2.hubspot.net/hubfs/53/tools/email-signature-generator/icons/address-icon-2x.png" color="#2687c0" width="13" class="sc-iRbamj blSEcj" style="display: block; background-color: rgb(38, 135, 192);">
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                                <td style="padding: 0px;">
                                                    <span color="#000000" class="sc-csuQGl CQhxV" style="font-size: 12px; color: rgb(0, 0, 0);">
                                                    <span>{{$address}}</span>
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr><td></td></tr>
            <tr><td></td></tr>
        </tbody>
    </table>
</div>
</body>
</html>