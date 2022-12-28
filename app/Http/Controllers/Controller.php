<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Ixudra\Curl\Facades\Curl;


use JoliCode\Slack\ClientFactory;
use JoliCode\Slack\Exception\SlackErrorResponse;

/**
 * @OA\Info(
 *    title="Promise Network Gift Cards API",
 *    version="1.0.0",
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function strip_quotes_from_message($message_body)
    {
        $els_to_remove = [
            'blockquote',                           // Standard quote block tag
            'div.moz-cite-prefix',                  // Thunderbird
            'div.gmail_extra', 'div.gmail_quote',   // Gmail
            'div.yahoo_quoted'                      // Yahoo
        ];

        $dom = new \PHPHtmlParser\Dom;
        $dom->load($message_body);

        foreach ($els_to_remove as $el) {
            $founds = $dom->find($el)->toArray();
            foreach ($founds as $f) {
                $f->delete();
                unset($f);
            }
        }

        // Outlook doesn't respect
        // http://www.w3.org/TR/1998/NOTE-HTMLThreading-0105#Appendix%20B
        // We need to detect quoted replies "by hand"
        //
        // Example of Outlook quote:
        //
        // <div>
        //      <hr id="stopSpelling">
        //      Date: Fri. 20 May 2016 17:40:24 +0200<br>
        //      Subject: Votre facture Selon devis DEV201605201<br>
        //      From: xxxxxx@microfactures.com<br>
        //      To: xxxxxx@hotmail.fr<br>
        //      Lorem ipsum dolor sit amet consectetur adipiscing...
        // </div>
        //
        // The idea is to delete #stopSpelling's parent...

        $hr  = $dom->find('#stopSpelling', /*nth result*/0);
        if (null !== $hr) {
            $hr->getParent()->delete();
        }

        // Roundcube adds a <p> with a sentence like this one, just
        // before the quote:
        // "Le 21-05-2016 02:25, AB Prog - Belkacem Alidra a écrit :"
        // Let's remove it
        $pattern = '/Le [0-9]{2}-[0-9]{2}-[0-9]{4} [0-9]{2}:[0-9]{2}, [^:]+ a &eacute;crit&nbsp;:/';
        $ps = $dom->find('p')->toArray();
        foreach ($ps as $p) {
            if (preg_match($pattern, $p->text())) {
                $p->delete();
                unset($p);
            }
        }

        // Let's remove empty tags like <p> </p>...
        $els = $dom->find('p,span,b,strong,div')->toArray();
        foreach ($els as $e) {
            $html = trim($e->innerHtml());
            if (empty($html) || $html == "&nbsp;") {
                $e->delete();
                unset($e);
            }
        }

        return $dom->root->innerHtml();
    }

    public function insertClearentLog($api_endpoint,$log) {
        \Log::channel('clearent')->info($api_endpoint);
        \Log::channel('clearent')->info($log);
    }
    public function getClearentBoardingAPI($api_endpoint,$merchantNumber = null) {
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding').'.clearent.net/api/'.$api_endpoint;
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: '.(env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeID: '.time())
            ->withHeader('MerchantID: '.$merchantNumber = null ? env('CLEARENT_HNK') : $merchantNumber)
            ->withHeader('Expect: ')
            ->get();
        $this->insertClearentLog($url,$response);
        return json_decode($response, true);
    }

    public function postClearentBoardingAPI($api_endpoint,$data,$merchantNumber = null) {

        $merchantId = $merchantNumber == null ? env('CLEARENT_HNK') : $merchantNumber;
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding').'.clearent.net/api/'.$api_endpoint;
        $response = Curl::to($url)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: '.(env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeId: '.time())
            ->withHeader('MerchantId: '.$merchantId)
            ->withHeader('Expect: ')
            ->post();
        $this->insertClearentLog($url,$response);
        $this->insertClearentLog('merchantNumber',$merchantNumber);
        $this->insertClearentLog('accessKey',(env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')));
        
        return json_decode($response, true);

    }


    public function deleteClearentBoardingAPI($api_endpoint,$merchantNumber = null) {

        $merchantId = $merchantNumber == null ? env('CLEARENT_HNK') : $merchantNumber;
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding').'.clearent.net/api/'.$api_endpoint;
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: '.(env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeId: '.time())
            ->withHeader('MerchantId: '.$merchantId)
            ->withHeader('Expect: ')
            ->delete();
        $this->insertClearentLog($url,$response);
        return json_decode($response, true);

    }

    public function putClearentBoardingAPI($api_endpoint,$data,$merchantNumber = null) {

        $merchantId = $merchantNumber == null ? env('CLEARENT_HNK') : $merchantNumber;
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding').'.clearent.net/api/'.$api_endpoint;
        $response = Curl::to($url)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: '.(env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeId: '.time())
            ->withHeader('MerchantId: '.$merchantId)
            ->withHeader('Expect: ')
            ->put();
        $this->insertClearentLog($url,$response);
        return json_decode($response, true);

    }

    public function generateMerchantNumber() {
        $data = (object)[
            "hierarchyNodeKey" => env('CLEARENT_HNK')
        ];
        $merchantNumber = $this->postClearentBoardingAPI('boardingmanagement/v1.0/applications/create',$data);
        // echo json_encode($data);
        // echo json_encode($merchantNumber);
        // return $merchantNumber;
        $merchantNumber = $merchantNumber['merchantNumber'];
        return $merchantNumber;
    }

    public function uploadMerchantFile($user_id, $category, $file, $file_name = '') {
        // echo $user_id;
        // $user_id = $request->user_id;
        // $file = $request->file('file');
        $file_name = $file_name != '' ? $file_name  : $file->getClientOriginalName();

        $user = \App\User::with('user_fields')->find($user_id);
        if($user) {
            $merchantName = isset($user->user_fields) ?  $user->user_fields->merchant_name : $user->id ;
            $merchantName = str_replace(' ','_',$merchantName);
    
            
            if($category != 'Paysafe Statement') {
                $file_name = $merchantName.$file_name;
            }


            $file_size = $this->bytesToHuman($file->getSize());
            $file_url = $file->storeAs(
                'public', time().'_'.$file_name
            );
    
            $file_url = str_replace('public/','',$file_url);
    
    
            $data = \App\MerchantFiles::create([
                'user_id' => $user_id,
                'category' => $this->getDocumentCategory($category),
                'file_size' => $file_size,
                'file_name' => $file_name,
                'file_url' => $file_url,
            ]);
    
            return $data;
        }
        
    }

    public function bytesToHuman($bytes)
    {
        $units = ['b', 'kb', 'mb', 'gb', 'tb', 'pb'];

        for ($i = 0; $bytes > 1024; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, 2) . ' ' . $units[$i];
    }

    private function getDocumentCategory($category) {
        $categories = [
            7 => "Signed Application",
            12 => "Voided Check",
            13 => "Bank Account Verification Results",
            16 => "Federal Firearms License",
            17 => "Sporting Goods and Firearms Addendum",
            21 => "Driver's License (Owner Identification)",
            23 => "Early Termination Fee Certificate",
            25 => "Site Photo",
            26 => "Inventory Photo",
            28 => "Multi-Location Addendum",
            29 => "MOTO Questionnaire",
            30 => "Personal Guarantee"
        ];

        return isset($categories[$category]) ? $categories[$category] : $category ;
    }

    public function generateRandomString($length = 10) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }


    public function curlPost($url, $data=NULL, $headers = NULL) {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if(!empty($data)){
            curl_setopt($ch,CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        }

        if (!empty($headers)) {
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        }

        $response = curl_exec($ch);

        if (curl_error($ch)) {
            trigger_error('Curl Error:' . curl_error($ch));
        }

        curl_close($ch);
        return $response;
    }

    function formatSizeUnits($bytes)
    {
        if ($bytes >= 1073741824)
        {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        }
        elseif ($bytes >= 1048576)
        {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        }
        elseif ($bytes >= 1024)
        {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        }
        elseif ($bytes > 1)
        {
            $bytes = $bytes . ' bytes';
        }
        elseif ($bytes == 1)
        {
            $bytes = $bytes . ' byte';
        }
        else
        {
            $bytes = '0 bytes';
        }

        return $bytes;
    }



    public function slackTicketNotif($ticket) {
        $client = ClientFactory::create('xoxb-2831012795332-2828770769779-7Kj3tFiW1WZqmnRCfXR9XDQE');

        try {
            // This method requires your token to have the scope "chat:write"
        
            $response = $client->chatPostMessage([ 
                'channel' => 'ticket-notif',
                'text' => 'Message with blocks', 
                'blocks' => json_encode([
                    [
                        "type" => "section",
                        "text" => [
                            "type" => "plain_text",
                            "text" => '',
                            "emoji" => true
                        ]
                    ],
                    [
                        "type" => "actions",
                        "elements" => [
                            [
                                "type" => "button",
                                "text" => [
                                    "type" => "plain_text",
                                    "emoji" => true,
                                    "text" => "Visit"
                                ],
                                "url" => "https://promise.network/tickets/ticket/".$ticket->id.""
                            ],
                            [
                                "type" => "button",
                                "text" => [
                                    "type" => "plain_text",
                                    "emoji" => true,
                                    "text" => "Mark as Resolved"
                                ],
                                "style" => "primary",
                                "url" => "https://promise.network/tickets/ticket/".$ticket->id."?status=Closed"
                            ],
                            [
                                "type" => "button",
                                "text" => [
                                    "type" => "plain_text",
                                    "emoji" => true,
                                    "text" => "Ignore"
                                ],
                                "style" => "danger",
                                "url" => "https://promise.network/tickets/ticket/".$ticket->id."?status=Archive"
                            ]
                        ]
                    ]
                ]),
            ]); 

            \Log::info('slack Messages sent.');;
        } catch (SlackErrorResponse $e) {
            \Log::info( 'Fail to send the message.', PHP_EOL, $e->getMessage());; 
        }
    }

    public function sendRequestToPngift($url, $method ,$data) {
        $url = env('PNGIFT_URL')."/api".$url;
        $ch = curl_init($url);
      
       

        if($method == 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS,$data );

            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: multipart/form-data',
                'Authorization: Bearer '.env('PNGIFT_API_KEY'),
            ]);

        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer '.env('PNGIFT_API_KEY'),
            ]);
        }
        if($method == 'UPDATE') {
            curl_setopt($ch, CURLOPT_POSTFIELDS,$data );
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        }
        if($method == 'DELETE') {
            curl_setopt($ch, CURLOPT_POSTFIELDS,$data );
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        }
        // SET Method as a PUT
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);
        // dd($result);

        return json_decode($result, true);
    }

}
