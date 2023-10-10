<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Ixudra\Curl\Facades\Curl;


use App\Consultants;
use App\ConsultantSchedule;
use App\EmailTemplate;
use App\Http\Controllers\API\v1\AppointmentController;
use Carbon\Carbon;
use Dcblogdev\Dropbox\Facades\Dropbox;
use Illuminate\Http\Request;

use function GuzzleHttp\default_user_agent;
use function GuzzleHttp\json_decode;
use function GuzzleHttp\json_encode;

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

        $hr  = $dom->find('#stopSpelling', /*nth result*/ 0);
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

    public function insertClearentLog($api_endpoint, $log)
    {
        \Log::channel('clearent')->info($api_endpoint);
        \Log::channel('clearent')->info($log);
    }
    public function getClearentBoardingAPI($api_endpoint, $merchantNumber = null)
    {
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding') . '.clearent.net/api/' . $api_endpoint;
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: ' . (env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeID: ' . time())
            ->withHeader('MerchantID: ' . $merchantNumber = null ? env('CLEARENT_HNK') : $merchantNumber)
            ->withHeader('Expect: ')
            ->get();
        $this->insertClearentLog($url, $response);
        return json_decode($response, true);
    }

    public function postClearentBoardingAPI($api_endpoint, $data, $merchantNumber = null)
    {

        $merchantId = $merchantNumber == null ? env('CLEARENT_HNK') : $merchantNumber;
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding') . '.clearent.net/api/' . $api_endpoint;
        $response = Curl::to($url)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: ' . (env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeId: ' . time())
            ->withHeader('MerchantId: ' . $merchantId)
            ->withHeader('Expect: ')
            ->post();
        $this->insertClearentLog($url, $response);
        $this->insertClearentLog('merchantNumber', $merchantNumber);
        $this->insertClearentLog('accessKey', (env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')));

        return json_decode($response, true);
    }


    public function deleteClearentBoardingAPI($api_endpoint, $merchantNumber = null)
    {

        $merchantId = $merchantNumber == null ? env('CLEARENT_HNK') : $merchantNumber;
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding') . '.clearent.net/api/' . $api_endpoint;
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: ' . (env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeId: ' . time())
            ->withHeader('MerchantId: ' . $merchantId)
            ->withHeader('Expect: ')
            ->delete();
        $this->insertClearentLog($url, $response);
        return json_decode($response, true);
    }

    public function putClearentBoardingAPI($api_endpoint, $data, $merchantNumber = null)
    {

        $merchantId = $merchantNumber == null ? env('CLEARENT_HNK') : $merchantNumber;
        $url = (env("CLEARENT_ENV") == 'sandbox' ? 'https://boarding-sb' : 'https://boarding') . '.clearent.net/api/' . $api_endpoint;
        $response = Curl::to($url)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('AccessKey: ' . (env('CLEARENT_ENV') == 'sandbox' ? env('CLEARENT_ACCESS_KEY_SANDBOX') : env('CLEARENT_ACCESS_KEY_PROD')))
            ->withHeader('ExchangeId: ' . time())
            ->withHeader('MerchantId: ' . $merchantId)
            ->withHeader('Expect: ')
            ->put();
        $this->insertClearentLog($url, $response);
        return json_decode($response, true);
    }

    public function generateMerchantNumber()
    {
        $data = (object) [
            "hierarchyNodeKey" => env('CLEARENT_HNK')
        ];
        $merchantNumber = $this->postClearentBoardingAPI('boardingmanagement/v1.0/applications/create', $data);
        // echo json_encode($data);
        // echo json_encode($merchantNumber);
        // return $merchantNumber;
        $merchantNumber = $merchantNumber['merchantNumber'];
        return $merchantNumber;
    }

    public function uploadMerchantFile($user_id, $category, $file, $file_name = '')
    {
        // echo $user_id;
        // $user_id = $request->user_id;
        // $file = $request->file('file');
        $file_name = $file_name != '' ? $file_name  : $file->getClientOriginalName();

        $user = \App\User::with('user_fields')->find($user_id);
        if ($user) {
            $merchantName = isset($user->user_fields) ?  $user->user_fields->merchant_name : $user->id;
            $merchantName = str_replace(' ', '_', $merchantName);


            if ($category != 'Paysafe Statement') {
                $file_name = $merchantName . $file_name;
            }


            $file_size = $this->bytesToHuman($file->getSize());
            $file_url = $file->storeAs(
                'public',
                time() . '_' . $file_name
            );

            $file_url = str_replace('public/', '', $file_url);


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

    private function getDocumentCategory($category)
    {
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

        return isset($categories[$category]) ? $categories[$category] : $category;
    }

    public function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }


    public function curlPost($url, $data = NULL, $headers = NULL)
    {
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        if (!empty($data)) {
            curl_setopt($ch, CURLOPT_POST, 1);
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
        if ($bytes >= 1073741824) {
            $bytes = number_format($bytes / 1073741824, 2) . ' GB';
        } elseif ($bytes >= 1048576) {
            $bytes = number_format($bytes / 1048576, 2) . ' MB';
        } elseif ($bytes >= 1024) {
            $bytes = number_format($bytes / 1024, 2) . ' KB';
        } elseif ($bytes > 1) {
            $bytes = $bytes . ' bytes';
        } elseif ($bytes == 1) {
            $bytes = $bytes . ' byte';
        } else {
            $bytes = '0 bytes';
        }

        return $bytes;
    }





    public function sendRequestToPngift($url, $method, $data)
    {
        $url = env('PNGIFT_URL') . "/api" . $url;
        $ch = curl_init($url);



        if ($method == 'POST') {
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: multipart/form-data',
                'Authorization: Bearer ' . env('PNGIFT_API_KEY'),
            ]);
        } else {
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . env('PNGIFT_API_KEY'),
            ]);
        }
        if ($method == 'UPDATE') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PUT');
        }
        if ($method == 'DELETE') {
            curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'DELETE');
        }
        // SET Method as a PUT
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $result = curl_exec($ch);
        curl_close($ch);
        // dd($result);

        return json_decode($result, true);
    }

    /**
     * @param mixed $id, data
     *
     *
     * $data = [
     *      'to_name'   => 'klaven',
     *      'to_email'   => 'admin@test.com',
     * ];
     *
     * others are optional
     *
     */

    public function setup_email_template($id, $data)
    {
        $email_template = EmailTemplate::find($id);

        $to_name = !empty($data['to_name']) ? $data['to_name'] : "";
        $to_email = !empty($data['to_email']) ? $data['to_email'] : "";
        $from_name = !empty($data['from_name']) ? $data['from_name'] : "ATC";
        $from_email = !empty($data['from_email']) ?  $data['from_email'] : "no-reply@airlinetc.com";
        $username = !empty($data['username']) ? $data['username'] : "";
        $password = !empty($data['password']) ? $data['password'] : "";
        $site_name = !empty($data['site_name']) ? $data['site_name'] : "ATC";
        $link_origin = !empty($data['link_origin']) ? $data['link_origin'] : "";
        $link = !empty($data['link']) ? $data['link'] : '';
        $token = !empty($data['token']) ? $data['token'] : "";
        $template = !empty($data['template']) ?  $data['template'] : 'admin.emails.email-template';
        $subject = "";
        $body = "";

        if (!empty($data['subject'])) {
            $subject = $data['subject'];
        } else {
            $subject = $email_template->subject;
            $subject = str_replace('[user:display-name]', $to_name, $subject);
            $subject = str_replace('[site:name]', $site_name, $subject);
        }

        if ($id == 1) {
            $a_link = '<a
            href="' . $link . '" class="es-button" target="_blank"
            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;font-size:18px;color:#333333;border-style:solid;border-color:#FEC300;border-width:10px 20px;display:inline-block;background:#FEC300;border-radius:4px;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;">click here to setup password</a>';

            $a_link_origin = '<a
            href="' . $link_origin . '" class="es-button" target="_blank"
            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;font-size:18px;color:#333333;border-style:solid;border-color:#FEC300;border-width:10px 20px;display:inline-block;background:#FEC300;border-radius:4px;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;">ATC Login</a>';

            $body = $email_template->body;
            $body = str_replace('[user:display-name]', $to_name, $body);
            $body = str_replace('[user:one-time-login-url]', $a_link, $body);
            $body = str_replace('[site:login-url]', $a_link_origin, $body);
            $body = str_replace('[user:account-name]', $username, $body);
        } else if ($id == 2) {
            $a_link = '<a
            href="' . $link . '" class="es-button" target="_blank"
            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;font-size:18px;color:#333333;border-style:solid;border-color:#FEC300;border-width:10px 20px;display:inline-block;background:#FEC300;border-radius:4px;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;">click here to setup password</a>';

            $a_link_origin = '<a
            href="' . $link_origin . '" class="es-button" target="_blank"
            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;font-size:18px;color:#333333;border-style:solid;border-color:#FEC300;border-width:10px 20px;display:inline-block;background:#FEC300;border-radius:4px;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;">ATC Login</a>';

            $body = $email_template->body;
            $body = str_replace('[user:display-name]', $to_name, $body);
            $body = str_replace('[user:one-time-login-url]', $a_link, $body);
            $body = str_replace('[site:login-url]', $a_link_origin, $body);
            $body = str_replace('[user:account-name]', $username, $body);
        } else if ($id == 3) {
            $body = $email_template->body;
            $body = str_replace('[user:display-name]', $to_name, $body);
        } else if ($id == 4) {
            $a_link = '<a
            href="' . $link . '" class="es-button" target="_blank"
            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;font-size:18px;color:#333333;border-style:solid;border-color:#FEC300;border-width:10px 20px;display:inline-block;background:#FEC300;border-radius:4px;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;">click here to login</a>';

            $a_link_origin = '<a
            href="' . $link_origin . '" class="es-button" target="_blank"
            style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, "helvetica neue", helvetica, arial, sans-serif;font-size:18px;color:#333333;border-style:solid;border-color:#FEC300;border-width:10px 20px;display:inline-block;background:#FEC300;border-radius:4px;font-weight:bold;font-style:normal;line-height:22px;width:auto;text-align:center;">ATC Login</a>';

            $body = $email_template->body;
            $body = str_replace('[user:display-name]', $to_name, $body);
            $body = str_replace('[user:one-time-login-url]', $a_link, $body);
            $body = str_replace('[site:login-url]', $a_link_origin, $body);
            $body = str_replace('[user:account-name]', $username, $body);
            $body = str_replace('[user:account-password]', $password, $body);
        } else if ($id == 5) {
            $body = $email_template->body;
            $body = str_replace('[user:field_first_name]', $to_name, $body);
        }

        $data_email = [
            'to_name'       => $to_name,
            'to_email'      => $to_email,
            'subject'       => $subject,
            'from_name'     => $from_name,
            'from_email'    => $from_email,
            'template'      => $template,
            'body_data'     => [
                "content" => $body,
            ]
        ];
        event(new \App\Events\SendMailEvent($data_email));
    }

    /** for stripe */

    /**
     * stripe_customer_charge function
     *
     * @param array $data
     * @return void
     */
    public function stripe_customer_charge($data)
    {
        $stripe = new \Stripe\StripeClient(env("APP_STRIPE_API_KEY"));

        $exp_date = explode('/', $data['card_expiry']);
        $exp_month = $exp_date[0];
        $exp_year = (int) '20' . $exp_date[1];

        // CREATE TOKEN
        $token = $stripe->tokens->create([
            'card' => [
                'number' => $data['credit_card_number'],
                'exp_month' => $exp_month,
                'exp_year' => $exp_year,
                'cvc' => $data['credit_cvv'],
            ],
        ]);

        $token_id = $token->id;

        // SEARCH FOR STRIPE ACCOUNT USING EMAIL AND METADATA
        $customer = $stripe->customers->search([
            'query' => 'email:\'' . $data['email'] . '\' AND metadata[\'app_name\']:\'' . $data['metadata']['app_name'] . '\'',
        ]);

        if ($customer && count($customer->data) > 0) {
            $customer = $stripe->customers->update(
                $customer->data[0]->id,
                [
                    'description' => $data['description'],
                    'name' => $data['firstname'] . ' ' . $data['lastname'],
                    'email' => $data['email'],
                    'address' => [
                        'line1' =>  $data['billing_street_address1'],
                        'line2' => isset($data['billing_street_address2']) ? $data['billing_street_address2'] : "",
                        'city' => $data['billing_city'],
                        'country' => $data['billing_country'],
                        'postal_code' => $data['billing_zip'],
                        'state' => $data['billing_state'],
                    ],
                    'shipping' => [
                        'address' => [
                            'line1' =>  $data['billing_street_address1'],
                            'line2' => isset($data['billing_street_address2']) ? $data['billing_street_address2'] : "",
                            'city' => $data['billing_city'],
                            'country' => $data['billing_country'],
                            'postal_code' => $data['billing_zip'],
                            'state' => $data['billing_state'],
                        ],
                        'name' => $data['firstname'] . ' ' . $data['lastname'],
                        // 'carrier' => '',
                        'phone' => !empty($data['phone_number']) ? $data['phone_number'] : "",
                        // 'tracking_number' => ''
                    ],
                    'source' => $token_id,
                    "metadata" => [
                        "app_name" => $data['metadata']['app_name']
                    ]
                ]
            );
        } else {
            // CREATE CUSTOMER
            $customer = $stripe->customers->create([
                'description' => $data['description'],
                'name' => $data['firstname'] . ' ' . $data['lastname'],
                'email' => $data['email'],
                'address' => [
                    'line1' =>  $data['billing_street_address1'],
                    'line2' => isset($data['billing_street_address2']) ? $data['billing_street_address2'] : "",
                    'city' => $data['billing_city'],
                    'country' => $data['billing_country'],
                    'postal_code' => $data['billing_zip'],
                    'state' => $data['billing_state'],
                ],
                'shipping' => [
                    'address' => [
                        'line1' =>  $data['billing_street_address1'],
                        'line2' => isset($data['billing_street_address2']) ? $data['billing_street_address2'] : "",
                        'city' => $data['billing_city'],
                        'country' => $data['billing_country'],
                        'postal_code' => $data['billing_zip'],
                        'state' => $data['billing_state'],
                    ],
                    'name' => $data['firstname'] . ' ' . $data['lastname'],
                    // 'carrier' => '',
                    'phone' => !empty($data['phone_number']) ? $data['phone_number'] : "",
                    // 'tracking_number' => ''
                ],
                'source' => $token_id,
                "metadata" => [
                    "app_name" => $data['metadata']['app_name']
                ]
            ]);
        }

        $charge = [];
        if ($data['charge_amount'] > 0) {
            $charge = $stripe->charges->create([
                'customer' => $customer->id,
                'receipt_email' =>  $data['email'],
                // 'source' => $token_id,
                'amount' =>  $data['charge_amount'] * 100,
                'currency' => 'usd',
                'description' => $data['charge_description'],
                'shipping' => [
                    'address' => [
                        'line1' => $data['billing_street_address1'],
                        'line2' => !empty($data['billing_street_address2']) ? $data['billing_street_address2'] : "",
                        'city' => $data['billing_city'],
                        'country' => $data['billing_country'],
                        'postal_code' => $data['billing_zip'],
                        'state' => $data['billing_state'],
                    ],
                    // 'email' => 'joshuasaubon@gmail.com',
                    'name' => $data['firstname'] . ' ' . $data['lastname'],
                    'phone' =>  !empty($data['phone_number']) ? $data['phone_number'] : "",
                ],
                [
                    'metadata' => [
                        "app_name" => $data['metadata']['app_name'],
                    ]

                ]
            ]);
        }

        return ['customer' => $customer, 'charge' => $charge];
    }

    /**
     * stripe_product_price function
     *
     * @param array $request = [
     * 'description' => 'description',
     * 'metadata' => ['app_name' => 'BFSS'],
     * 'name' => 'name',
     * 'price_info' => [
     *      'billing_scheme' => 'billing_scheme',
     *      'metadata' => [
     *          'app_name' => 'BFSS'
     *      ],
     *      'recurring' => [
     *          'interval' => 'month',
     *          'interval_count' => 1,
     *          'usage_type' => 'licensed'
     *      ],
     *      'unit_amount_decimal' => 99.99 * 100
     * ],
     * ]
     * @return void
     */
    public function stripe_product_price($request)
    {
        $stripe = new \Stripe\StripeClient(env("APP_STRIPE_API_KEY"));
        // SEARCH FOR STRIPE PRODUCT USING EMAIL
        // $product = $stripe->products->all([
        //     'limit' => 1,
        //     'id' => $request['stripe_id']
        // ])->first();

        $product = $stripe->products->create([
            // "id" => "prod_Lb9PSww9OWdokA",
            // "object" => "product",
            "active" => true,
            // "created" => 1651251359,
            // "default_price" => "price_1Ktx6rKZSUuelLLRJjygJIjj",
            "description" => $request['description'],
            "images" => [],
            // "livemode" => false,
            "metadata" => [
                "app_name" => $request['metadata']['app_name']
            ],
            "name" => $request['name'],
            // "package_dimensions" => null,
            // "shippable" => null,
            // "statement_descriptor" => null,
            // "tax_code" => "txcd_20030000",
            // "unit_label" => null,
            // "updated" => 1651876386,
            // "url" => null
        ]);

        if ($product) {
            $price = $stripe->prices->create([
                // "id" => "price_1LI3t2KZSUuelLLRjc7AyDsU",
                // "object" => "price",
                "active" => true,
                "billing_scheme" => $request['price_info']["billing_scheme"],
                // "created" => 1656997284,
                "currency" => "usd",
                // "custom_unit_amount" => null,
                // "livemode" => false,
                "lookup_key" => null,
                "metadata" => [
                    'app_name' => $request['price_info']['metadata']['app_name']
                ],
                // "nickname" => null,
                "product" => $product->id,
                "recurring" => [
                    // "aggregate_usage" => null,
                    "interval" => $request['price_info']['recurring']['interval'],
                    "interval_count" => $request['price_info']['recurring']['interval_count'],
                    "usage_type" => $request['price_info']['recurring']['usage_type']
                ],
                // "tax_behavior" => "exclusive",
                // "tiers_mode" => '24.95',
                // "transform_quantity" => null,
                // "type" => "recurring",
                // "unit_amount" => "24.95",
                "unit_amount_decimal" => $request['price_info']['unit_amount_decimal']
            ]);
        }

        return ['product' => $product, 'price' => $price];
    }
    /** for stripe */

    /*for gohighlevel*/

    public function postGoHighlevelAPI($data)
    {

        // error_log(env('GOHIGHLEVEL_API_KEY'));
        $url = 'https://rest.gohighlevel.com/v1/contacts/';
        $response = Curl::to($url)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->post();

        return json_decode($response, true);
    }

    public function checkGoHighlevelAPI($id)
    {
        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $id;
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        return json_decode($response, true);
    }

    public function getGoHighlevelTask($data)
    {

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $data . '/tasks/';
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        return json_decode($response, true);
    }


    public function postGoHighlevelTask($data)
    {

        $post_data = [
            "title" => $data['title'],
            "description"  => $data['description'],
            "dueDate"  => date('Y-m-d\TH:i:00\Z', strtotime($data['dueDate'])),
            "status" => "incompleted"
        ];

        // return response()->json([
        //     'success' => true,
        //     'data' =>   date('Y-m-d\TH:i:s0\Z' , strtotime($data['dueDate'])),
        // ], 200);

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $data['id'] . '/tasks/';
        $response = Curl::to($url)
            ->withData(json_encode($post_data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer 47923a7e-753c-4a88-9073-87978118307f')
            ->post();

        return json_decode($response, true);
    }

    public function getGoHighlevelNotes($data)
    {

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $data . '/notes/';
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer 47923a7e-753c-4a88-9073-87978118307f')
            ->get();

        json_decode($response, true);
    }

    public function getGoHighlevelTeamCalendar()
    {

        $url = 'https://rest.gohighlevel.com/v1/calendars/services?teamId=' . env('GOHIGHLEVEL_TEAM_CALENDAR_ID');
        $ApiResponse = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->get();

        $user = \App\User::with('user_consultant')->find(auth()->user()->id);

        if ($ApiResponse->status == 200) {

            $response = $ApiResponse->content;
            if ($user->assigned_consultant !== null) {
                $data_raw = [];
                foreach (json_decode($response)->services as $item) {
                    //    if ($user->user_consultant) {
                    //       if ($item->id ===  $user->user_consultant->calendar_id) {
                    array_push($data_raw, $item);
                    //       }
                    // /    }
                };

                $data = Collect($data_raw);
            } else {
                $consultant = Consultants::select('name')->where('role', 'special consultant')->get();
                $consultant_names = [];

                foreach ($consultant as $con) {
                    array_push($consultant_names, $con->name);
                }

                $data_raw = [];
                foreach (json_decode($response)->services as $item) {
                    if (in_array($item->name, $consultant_names) == 0) {
                        array_push($data_raw, $item);
                    }
                };

                $data = Collect($data_raw);
            }
        }

        return  $data;
    }

    public function getGoHighlevelAppointmentSlots($data)
    {

        $startTime = $data->startDate;
        $endTime = $data->endDate;
        $timeZone = $data->selectedTimeZone;

        $colorHex = ['#84ffea', '#ff1493', '#ffa500', '#6d5ecb', '#4a90e2', '#ffaae8', '#ffbfb6', '#c0ffdf'];

        $consultants_calendar =  $this->getGoHighlevelTeamCalendar();
        $count = 0;

        $slots = collect($consultants_calendar)->map(function ($q) use ($startTime, $endTime, $timeZone, $colorHex, &$count) {

            $slot_data = [];

            $url = 'https://rest.gohighlevel.com/v1/appointments/slots?calendarId=' . $q->id . '&startDate=' . $startTime . '&endDate=' . $endTime . '&timezone=Asia/Kuala_Lumpur' .  $timeZone;
            $response = Curl::to($url)

                ->withHeader('Content-Type: application/json')
                ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
                ->get();

            $slot_data['events'] = [];

            foreach (json_decode($response) as $schedule_days) {
                array_push($slot_data['events'], [
                    'title' => $q->name,
                    'start' => $schedule_days->slots[0],
                    'end' => $schedule_days->slots[count($schedule_days->slots) - 1],
                    'extendedProps' => ['slots' => $schedule_days->slots, 'calendar_id' => $q->id],
                    'color' => $colorHex[$count],
                ]);
            }


            $count += 1;
            return  $slot_data;
        });

        return response()->json([
            'data' =>  $slots
        ], 200);


        //  return  json_decode($response, true);
    }

    public function getGoHighlevelAddAppointment($data)
    {
        $url = 'https://rest.gohighlevel.com/v1/appointments/';

        $response = Curl::to($url)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->post();

        return  $response;
    }

    public function getGoHighlevelAppointment($data)
    {

        $user = auth()->user();


        if ($user->role == 'Consultant') {
            $calendar_id = $user->go_high_level_id;
        } else {
            $calendar_id = $data->calendar_id;
        }


        $dateEnd = Carbon::parse($data->endDate);
        $dateStart = Carbon::parse($data->startDate);


        $url = 'https://rest.gohighlevel.com/v1/appointments/?startDate=' . $dateStart->getPreciseTimestamp(3) . '&endDate=' . $dateEnd->getPreciseTimestamp(3) . '&calendarId=' . $calendar_id . '&includeAll=true';

        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->get();

        return  json_decode($response->content);
    }


    public function get_temporary_link($data)
    {

        $url = 'https://api.dropboxapi.com/2/files/get_temporary_link';

        $dropbox_temporary_link = [];
        $token = dropbox::getAccessToken();

        for ($i = 0; $i < collect($data)->count(); $i++) {
            $params = [
                "path" => $data[$i]->path_lower,
            ];

            $response = Curl::to($url)
                ->withData(json_encode($params))
                ->withHeader('Content-Type: application/json')
                // ->withHeader('Dropbox-API-Arg: '.$params)
                ->withHeader('Authorization: Bearer ' . $token)
                ->post();
            $res = json_decode($response);
            array_push($dropbox_temporary_link, $res->link);
        }

        return $dropbox_temporary_link;
    }

    public function get_pipelines()
    {

        $url = 'https://rest.gohighlevel.com/v1/pipelines';

        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        if (empty($response)) {

            return $response;
        }
        return json_decode($response);
    }

    public function get_user_opportunity()
    {

        // $user = auth()->user();
        // $pipeline  = $this->get_pipelines();

        // $pipeline_id_progress = $pipeline->pipelines[0]->id;
        // $url = 'https://rest.gohighlevel.com/v1/pipelines/' . $pipeline_id_progress . '/opportunities?query=' . $user->email;
        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();

        // $user_current_stage = json_decode($response);

        // if (count($user_current_stage->opportunities) == 0) {
        //     return response()->json([
        //         'success' => true,
        //         'data' => 'nodata',
        //         'pipeline_id' => '',
        //         'pipeline_stages' => []
        //     ], 200);
        // }

        // $pipeline_current_stage = $user_current_stage->opportunities[0]->pipelineStageId;

        // $pipeline_stages = $pipeline->pipelines[0]->stages;
        // $status = 'finish';

        // $pipeline_stages = collect($pipeline_stages)->map(function ($q) use ($pipeline_current_stage, &$status) {
        //     if ($q->id === $pipeline_current_stage) {
        //         $q->status = 'process';
        //         $status = 'wait';
        //     } else {
        //         $q->status = $status;
        //     }
        //     return $q;
        // });


        // $pipeline_id_appointment =  $pipeline->pipelines[1]->id;


        // $url = 'https://rest.gohighlevel.com/v1/pipelines/' . $pipeline_id_appointment . '/opportunities?query=' . $user->email;
        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();


        // $user_current_stage_appointment = json_decode($response);


        // //   print_r($user_current_stage_appointment);
        // $pipeline_stages_appointment = [];
        // if (count($user_current_stage_appointment->opportunities) != 0) {
        //     $pipeline_current_stage_appointment = $user_current_stage_appointment->opportunities[0]->pipelineStageId;

        //     $pipeline_stages_appointment = $pipeline->pipelines[1]->stages;

        //     $status = 'finish';

        //     $pipeline_stages_appointment = collect($pipeline_stages_appointment)->map(function ($q) use ($pipeline_current_stage_appointment, &$status) {
        //         if ($q->id === $pipeline_current_stage_appointment) {
        //             $q->status = 'process';
        //             $status = 'wait';
        //         } else {
        //             $q->status = $status;
        //         }
        //         return $q;
        //     });
        // }

        $user = auth()->user();
        $pipeline_stages = \App\UserProgressTimeline::where('user_id', $user->id)->get();
        $pipeline_stages_appointment = \App\UserAppointmentProgress::where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            // 'data' => $user_current_stage->opportunities[0],
            // 'pipeline_id' => $pipeline_current_stage,
            'pipeline_stages' => $pipeline_stages,
            'pipeline_stages_appointment' => $pipeline_stages_appointment,
            // 'pipelines' => $pipeline->pipelines
        ], 200);

        //  return $response;
    }


    public function get_consultant_opportunity($id)
    {

        $get_user = auth()->user();

        if ($get_user->role != 'User') {

            if (is_numeric($id)) {

                $user = \App\User::where('id', $id)->first();
            } else {
                $user = \App\User::where('go_high_level_id', 'like', $id)->first();
            }
        } else {
            $user =  $get_user;
        }


        // $pipeline  = $this->get_pipelines();

        // $pipeline_id_progress = $pipeline->pipelines[0]->id;
        // $url = 'https://rest.gohighlevel.com/v1/pipelines/' . $pipeline_id_progress . '/opportunities?query=' . $user->email;
        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();

        // $user_current_stage = json_decode($response);

        // //   print_r($user_current_stage);
        // if (count($user_current_stage->opportunities) === 0) {
        //     return response()->json([
        //         'success' => true,
        //         'data' => 'nodata',
        //         'pipeline_id' => '',
        //         'pipeline_stages' => []
        //     ], 200);
        // }

        // $pipeline_current_stage = $user_current_stage->opportunities[0]->pipelineStageId;

        // $pipeline_stages = $pipeline->pipelines[0]->stages;
        // $status = 'finish';

        // $pipeline_stages = collect($pipeline_stages)->map(function ($q) use ($pipeline_current_stage, &$status) {
        //     if ($q->id === $pipeline_current_stage) {
        //         $q->status = 'process';
        //         $status = 'wait';
        //     } else {
        //         $q->status = $status;
        //     }
        //     return $q;
        // });


        // $pipeline_id_appointment =  $pipeline->pipelines[1]->id;
        // $url = 'https://rest.gohighlevel.com/v1/pipelines/' . $pipeline_id_appointment . '/opportunities?query=' . $user->email;
        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();

        // $user_current_stage_appointment = json_decode($response);

        // //   print_r($user_current_stage_appointment);
        // if (count($user_current_stage_appointment->opportunities) === 0) {
        //     return response()->json([
        //         'success' => true,
        //         'data' => 'nodata',
        //         'pipeline_id' => '',
        //         'pipeline_stages' => []
        //     ], 200);
        // }

        // $pipeline_current_stage_appointment = $user_current_stage_appointment->opportunities[0]->pipelineStageId;

        // $pipeline_stages_appointment = $pipeline->pipelines[1]->stages;

        // $status = 'finish';

        // $pipeline_stages_appointment = collect($pipeline_stages_appointment)->map(function ($q) use ($pipeline_current_stage_appointment, &$status) {
        //     if ($q->id === $pipeline_current_stage_appointment) {
        //         $q->status = 'process';
        //         $status = 'wait';
        //     } else {
        //         $q->status = $status;
        //     }
        //     return $q;
        // });

        $pipeline_stages = \App\UserProgressTimeline::where('user_id', $user->id)->get();
        $pipeline_stages_appointment = \App\UserAppointmentProgress::where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            // 'data' => $user_current_stage->opportunities[0],
            // 'pipeline_id' => $pipeline_current_stage,
            'pipeline_stages' => $pipeline_stages,
            'pipeline_stages_appointment' => $pipeline_stages_appointment,
            // 'pipelines' => $pipeline->pipelines
        ], 200);

        //  return $response;
    }

    public function get_all_opportunity($data)
    {
        $pipeline  = $this->get_pipelines();

        $first_pipeline = $pipeline->pipelines[$data];

        $atc_pipelines = [
            'App Analysis' => [
                'meta' => [],
                'opportunities' => []
            ],
            'Clients Stage' => [
                'meta' => [],
                'opportunities' => []
            ],
            'Appointment Stage' => [
                'meta' => [],
                'opportunities' => []
            ],
            'Docs for Evaluation' => [
                'meta' => [],
                'opportunities' => []
            ],
            'Publish' => [
                'meta' => [],
                'opportunities' => []
            ],
            'Completed' => [
                'meta' => [],
                'opportunities' => []
            ],
        ];


        // foreach ($first_pipeline->stages as $stage) {

        //     $url = 'https://rest.gohighlevel.com/v1/pipelines/' . $first_pipeline->id . '/opportunities?pipelineStageId=' . $stage->id;
        //     $response = Curl::to($url)
        //         ->withHeader('Content-Type: application/json')
        //         ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //         ->get();

        //     $atc_pipelines[$stage->name]  = json_decode($response, true);
        // }



        return response()->json([
            'success' => true,
            'data' => $atc_pipelines,

        ], 200);
    }

    // public function get_opportunity_per_id(Request $request)
    // {

    //     $url = $request->url;
    //     $response = Curl::to($url)
    //         ->withHeader('Content-Type: application/json')
    //         ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
    //         ->get();

    //     $new_data = json_decode($response, true);


    //     return response()->json([
    //         'success' => true,
    //         'data' => $new_data
    //     ], 200);
    // }


    public function get_custom_fields($query)
    {
        $url = 'https://rest.gohighlevel.com/v1/custom-fields/';
        $response = Curl::to($url)
            // ->withData()
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $custom_field = json_decode($response)->customFields;

        $queried_field = [];
        foreach ($custom_field as $item) {
            if ($item->fieldKey === $query) {
                $queried_field = $item;
            }
        };

        return $queried_field;
    }

    public function get_schedule()
    {
        $user = auth()->user();

        // $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/appointments/';
        // $response = Curl::to($url)
        //     // ->withData()
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();

        // $teamCalendar = $this->getGoHighlevelTeamCalendar();
        $data = ConsultantSchedule::with(['user'])->where('booked_by', $user->id)->get();

        return response()->json([
            'success' => true,
            // 'teamCalendar' => $teamCalendar,
            // 'userAppointment' => $userAppointment,
            // 'data' => json_decode($response),
            'data' => $data
        ], 200);
    }

    public function get_last_appointment($appointmentId)
    {
        $user = auth()->user();

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/appointments/';
        $appointments = Curl::to($url)
            // ->withData()
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $appointments = json_decode($appointments, true);
        $user_appointments = $appointments['events'];


        foreach ($user_appointments as $user_appointment) {
            if ($user_appointment['id'] == $appointmentId) {
                $last_appointment = $user_appointment;
            }
        }



        return  $last_appointment;
    }

    public function get_existing_files()
    {

        $user = auth()->user();

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
        $response = Curl::to($url)
            // ->withData()
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();


        if (!empty(json_decode($response)->contact->customField)) {
            return  json_decode($response)->contact->customField[0]->value;
        }

        return "";
    }

    public function get_ghl_files($id)
    {
        if (is_numeric($id)) {
            $user = \App\User::where('id', $id)->first();
        } else {
            $user = \App\User::where('id', $id)->first();
            // $user = \App\User::where('go_high_level_id', $id)->first();
        }



        // $get_contact_details = Curl::to('https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id)
        //     // ->withData()
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->get();

        // $get_custom_fields = Curl::to('https://rest.gohighlevel.com/v1/custom-fields/')
        //     // ->withData()
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();

        // $contact_custom_fields = json_decode($get_contact_details->content, true);
        // $contact =   $contact_custom_fields['contact'];
        // $contact_custom_fields =   $contact['customField'];
        //     $task = $contact['tasks'];

        // $custom_fields = json_decode($get_custom_fields, true)['customFields'];


        $_new_custom_fields =  [];
        // foreach ($contact_custom_fields as $field) {
        //     foreach ($custom_fields as $form_field) {
        //         if ($form_field['id'] == $field['id']) {


        //             $array_data =   [];
        //             $array_key = $form_field['fieldKey'];
        //             $array_data = ['key' => $array_key, 'value' => $field['value']];
        //             array_push($_new_custom_fields, $array_data);
        //         }
        //     }
        // }

        $tags = \App\UserTag::where('user_id', $user->id)->pluck('tag')->toArray();
        $data = ['tags' => $tags,  'custom_fields' => $_new_custom_fields];

        // array_push($data,  $tags);
        // array_push($data, $_new_custom_fields);
        //  $data->customFields = $_new_custom_fields;

        return response()->json(['success' => true, 'data' =>  $data]);
    }

    public function document_url($data)
    {

        $user = auth()->user();

        $custom_field_id = $this->get_custom_fields('contact.add_your_document_url');

        $file_paths = [];

        for ($i = 0; $i < collect($data)->count(); $i++) {
            array_push($file_paths, $data[$i]->name);
        }


        $params = [
            'email' => $user->email,
            'customField' => [$custom_field_id->id => $file_paths]
        ];

        $params = json_encode($params);
        $params = str_replace("[", "", $params);
        $params = str_replace("]", "", $params);



        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
        $response = Curl::to($url)
            ->withData($params)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->put();

        return $response;
    }

    public function upload_requirements($data)
    {

        $user = auth()->user();

        $current_tag = $this->get_current_tag();
        $all_tag  = $this->get_all_tags();


        if (is_array($current_tag)) {
            $current_tag = json_encode($current_tag);
        }

        if (is_array($all_tag)) {
            $all_tag = json_encode($all_tag);
        }


        switch ($current_tag) {

            case ((str_contains($current_tag, 'call 1 - upload requirements (current task)'))):
                $custom_field_name = "contact.requirements_or_homework1";
                $custom_field_id = $this->get_custom_fields($custom_field_name);

                $tags_to_add = [
                    //      'call 1 - requirements approval (current task)',
                    'call 1 - upload requirements (done)'
                ];

                // $tags_to_remove =
                //     'call 1 - call (done)'
                //     // 'call 1 - upload requirements (current task)'
                // ;

                // REMOVE TAG: call 1 - call (done)
                // REMOVE TAG: call 1 - upload requirements (current task)
                // ADD TAG: call 1 - requirements approval (current task)
                // ADD TAG: call 1 - upload requirements (done)
                break;
            case ((str_contains($current_tag, 'call 2 - upload requirements (current task)'))):

                if (str_contains($all_tag, 'timeline - book (current task)') || str_contains($all_tag, 'timeline - book (done)')) {
                    $custom_field_name = "contact.requirements_or_homework3";
                    $custom_field_id = $this->get_custom_fields($custom_field_name);
                } else {

                    $custom_field_name = "contact.requirements_or_homework2";
                    $custom_field_id = $this->get_custom_fields($custom_field_name);
                }


                $tags_to_add = [
                    //       'call 2 - requirements approval (current task)',
                    'call 2 - upload requirements (done)'
                ];

                // $tags_to_remove =
                //     'call 2 - call (done)'
                //     // 'call 2 - upload requirements (current task)'
                // ;

                // REMOVE TAG: call 2 - call (done)
                // REMOVE TAG: call 2 - upload requirements (current task)
                // ADD TAG: call 2 - requirements approval (current task)
                // ADD TAG: call 2 - upload requirements (done)
                break;
            case ((str_contains($current_tag, 'follow up call - upload requirements (current task)'))):
                $custom_field_name = "contact.requirements_or_homework3";
                $custom_field_id = $this->get_custom_fields($custom_field_name);

                $tags_to_add = [
                    //      'follow up call - requirements approval (current task)',
                    'follow up call - upload requirements (done)'
                ];
                // $tags_to_remove =
                //     'follow up call - call (done)'
                //     // 'follow up call - upload requirements (current task)'
                // ;

                // REMOVE TAG: follow up call - call (done)
                // REMOVE TAG: follow up call - upload requirements (current task)
                // ADD TAG: follow up call - requirements approval (current task)
                // ADD TAG: follow up call - upload requirements (done)
                break;
            case ((str_contains($current_tag, 'timeline - upload requirements (current task)'))):
                $custom_field_name = "contact.requirements_or_homework4";
                $custom_field_id = $this->get_custom_fields($custom_field_name);


                $tags_to_add = [
                    //   'timeline - requirements approval (current task)',
                    'timeline - upload requirements (done)'
                ];
                // $tags_to_remove =
                //     'timeline - call (done)'
                //     // 'timeline - upload requirements (current task)'
                // ;

                // REMOVE TAG: timeline - call (done)
                // REMOVE TAG: timeline - upload requirements (current task)
                // ADD TAG: timeline - requirements approval (current task)
                // ADD TAG: timeline - upload requirements (done)
                break;
            case ((str_contains($current_tag, 'pre publish - upload requirements (current task)'))):
                $custom_field_name = "contact.requirements_or_homework5";
                $custom_field_id = $this->get_custom_fields($custom_field_name);

                $tags_to_add = [
                    //    'pre publish - requirements approval (current task)',
                    'pre publish - upload requirements (done)'
                    //   'pre publish'
                ];
                // $tags_to_remove =
                //     'pre publish - call (done)'
                //     // 'pre publish - upload requirements (current task)'
                // ;

                // REMOVE TAG: pre publish - call (done)
                // REMOVE TAG: pre publish - upload requirements (current task)
                // ADD TAG: pre publish - requirements approval (current task)
                // ADD TAG: pre publish - upload requirements (done)
                break;
            case ((str_contains($current_tag, 'pre interview - upload requirements (current task)'))):
                $custom_field_name = "contact.requirements_or_homework6";
                $custom_field_id = $this->get_custom_fields($custom_field_name);


                $tags_to_add = [
                    //         'pre interview - requirements approval (current task)',
                    'pre interview - upload requirements (done)'
                ];
                //  $tags_to_remove =
                //'pre interview - call (done)'
                //   'pre interview - upload requirements (current task)';

                // REMOVE TAG: pre interview - call (done)
                // REMOVE TAG: pre interview - upload requirements (current task)
                // ADD TAG: pre interview - requirements approval (current task)
                // ADD TAG: pre interview - upload requirements (done)
                break;
            case ((str_contains($current_tag, '1 hour update') && str_contains($current_tag, 'upload requirements (current task)'))):


                $upload_number = explode(' ', $current_tag)[3];

                $custom_field_name = "contact.1_hour_update_upload_" . $upload_number;
                $custom_field_id = $this->get_custom_fields($custom_field_name);

                $tags_to_add = [
                    '1 hour update ' . $upload_number . ' - upload requirements (done)'
                ];
                //    $tags_to_remove =
                //     '1 hour update ' . $upload_number . ' - call  (done)',
                // '1 hour update ' . $upload_number . ' - upload requirements (current task)';

                // REMOVE TAG: pre interview - call (done)
                // REMOVE TAG: pre interview - upload requirements (current task)
                // ADD TAG: pre interview - requirements approval (current task)
                // ADD TAG: pre interview - upload requirements (done)
                break;
            default:
                return "something went wrong";
        }

        $file_paths = [];


        for ($i = 0; $i < collect($data)->count(); $i++) {
            array_push($file_paths, $data[$i]->name);
        }

        $params = [
            'email' => $user->email,
            'customField' => [$custom_field_id->id => $file_paths]
        ];

        $params = json_encode($params);
        $params = str_replace("[", "", $params);
        $params = str_replace("]", "", $params);

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
        $response = Curl::to($url)
            ->withData($params)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->put();

        $hasError = [];
        if ($response->status != 200) {
            // $hasError[] = 'Error while writing link to Go High Level';
            $hasError[] = $response;
        }

        $data = (object) [];
        $data->tag = $tags_to_add;
        // $remove_tags = $this->remove_tag($tags_to_remove);

        $add_tags = $this->add_tag($data);

        // if ($remove_tags != 200) {
        //     $hasError[] = 'Error while removing tags on Go High Level';
        // } else
        if ($add_tags != 200) {
            $hasError[] = 'Error while  adding tags on Go High Level';
        }

        if (count($hasError) != 0) {
            return ['error' => true, 'error_message' => $hasError];
        } else {
            return $response;
        }
    }

    public function get_meta_data($data)
    {

        $url = 'https://api.dropboxapi.com/2/files/get_metadata';

        $meta_data = [];
        $token = dropbox::getAccessToken();

        for ($i = 0; $i < collect($data)->count(); $i++) {
            $params = [
                "path" => $data['entries'][$i]['path_lower'] . '/' . $data['entries'][$i]['name'],
            ];

            $response = Curl::to($url)
                ->withData(json_encode($params))
                ->withHeader('Content-Type: application/json')
                // ->withHeader('Dropbox-API-Arg: '.$params)
                ->withHeader('Authorization: Bearer ' . $token)
                ->post();
            $res = json_decode($response);
            array_push($meta_data, $res);
        }

        return $meta_data;
    }



    public function get_task_details($query)
    {
        // if (auth()->user()->role === "User") {
        //     $task = $this->get_task_details('Consultation Call');
        // } else {
        //     $task = $this->get_task_details(['query' => 'Consultation Call', 'id' => $id]);
        // }
        // $params = Route::current()->parameters();

        if (is_array($query)) {

            $user = \App\User::where('id', $query['id'])->first();

            $query = $query['query'];
        } else {
            $user = auth()->user();
        }

        $response = \App\UserTask::where('user_id', $user->id)->where('title', $query)->where('status', 'pending')->get();
        return $response;



        // $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tasks/';
        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->get();

        // $queried_task = [];
        // // if ($response->status == 200) {
        // //     $task = json_decode($response->content)->tasks;

        // //     foreach ($task as $item) {
        // //         if ($item->title === $query) {
        // //             if ($item->isCompleted != 1) {
        // //                 $queried_task = $item;
        // //             }
        // //         }
        // //     };
        // // } else {
        // //     $queried_task[] = "";
        // // }
        // if (isset($response)) {
        //     $queried_task = $response;
        // } else {
        //     $queried_task[] = "";
        // }

    }

    public function get_done_task_details($query)
    {

        $user = auth()->user();

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tasks/';
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $task = json_decode($response)->tasks;

        $queried_task = [];
        foreach ($task as $item) {
            if ($item->title === $query) {
                if ($item->isCompleted == 1) {
                    $queried_task = $item;
                }
            }
        };

        return  $queried_task;
    }

    public function get_all_tags($data)
    {
        // $user = auth()->user();

        // $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;

        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->withResponseHeaders()
        //     ->get();

        // $tags = json_decode($response)->contact->tags;

        // return $tags;

        $current_tag = \App\UserTag::where('user_id', $data['user_id'])->pluck('tag')->toArray();
        return json_encode($current_tag);
    }



    public function get_current_tag($id = null)
    {
        if (auth()->user()->role === "User") {
            $user = auth()->user();
        } else {
            $user = \App\User::find($id);
        }

        // $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;

        // $response = Curl::to($url)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->get();

        // $tags = json_decode($response)->contact->tags;
        $tags = \App\UserTag::where('user_id', $user->id)->pluck('tag')->toArray();
        $current_task_tag = [];
        foreach ($tags as $tag) {

            // if (str_contains($tag, 'book (current task)') == true) {
            //     $book_task = $this->get_done_task_details('Book Appointment');
            //     if ($book_task) {
            //         $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $book_task->id];
            //         $this->unmarktask($task_data);
            //     }
            // } else if (str_contains($tag, 'book') && str_contains($tag, '(current task)')) {
            //     $book_task = $this->get_done_task_details('Book Appointment');
            //     if ($book_task) {
            //         $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $book_task->id];
            //         $this->unmarktask($task_data);
            //     }
            // }

            if (str_contains($tag, 'call (done)') == true) {
                if (str_contains($tag, 'waiting for atc rep call (done)') == true) {
                    if (auth()->user()->role === "User") {
                        $task = $this->get_task_details('Wait For ATC Rep');
                    } else {
                        $task = $this->get_task_details(['query' => 'Wait For ATC Rep', 'id' => $id]);
                    }
                } else if (str_ends_with($tag, '- call (done)')) {

                    $task = [];

                    if (str_contains($tag, '1 hour update') && str_contains($tag, 'call (done)')) {

                        // if (auth()->user()->role === "User") {
                        //     $task = $this->get_task_details('Consultation Call');
                        // } else {
                        //     $task = $this->get_task_details(['query' => 'Consultation Call', 'id' => $id]);
                        // }

                        // $removeTag = ['user_id' => $user->id, 'tag' => $tag];
                        // $this->remove_tag($removeTag);
                    } else if ($tag == 'pre publish - call (done)') {

                        // if (auth()->user()->role === "User") {
                        //     $task = $this->get_task_details('Consultation Call');
                        // } else {
                        //     $task = $this->get_task_details(['query' => 'Consultation Call', 'id' => $id]);
                        // }

                        // $removeTag = ['user_id' => $user->id, 'tag' => ['pre publish - call (done)']];
                        // $this->remove_tag($removeTag);
                    } else if (str_ends_with($tag, 'call 2 - call (done)')) {
                        // $get_all_tags = ['user_id' => $user->id];
                        // $allaTags = $this->get_all_tags($get_all_tags);
                        // if (in_array('follow up call - book (current task)', $allaTags) || in_array('timeline - book (current task)', $allaTags)) {
                        //     if (auth()->user()->role === "User") {
                        //         $task = $this->get_task_details('Consultation Call');
                        //     } else {
                        //         $task = $this->get_task_details(['query' => 'Consultation Call', 'id' => $id]);
                        //     }

                        //     $removeTag = ['user_id' => $user->id, 'tag' => $tag];
                        //     $this->remove_tag($removeTag);
                        //     // $this->remove_tag($tag);
                        // }
                    } else {
                        //        $task = $this->get_task_details('Consultation Call');
                        // $removeTag = ['user_id' => $user->id, 'tag' => $tag];
                        // $this->remove_tag($removeTag);
                        // $this->remove_tag($tag);
                    }


                    // $book_task = $this->get_done_task_details('Book Appointment');
                    // $new_book_task = $this->get_task_details('Book Appointment');


                    // $hasNullSchedule = \App\Appointment::where('user_id', $user->id)->whereNull('status')->count();

                    // if (collect($new_book_task)->isEmpty()) {
                    //     if (!collect($book_task)->isEmpty()) {
                    //         if ($hasNullSchedule == 0) {
                    //             $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $book_task->id];
                    //             $this->unmarktask($task_data);
                    //             $this->remove_tag($tag);
                    //         }
                    //     }
                    // }
                }

                if (!collect($task)->isEmpty()) {
                    error_log(json_encode($task));
                    // $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $task->id];
                    // $this->marktask($task_data);

                    // $data = ['ghl_id' => $user->id, 'task_id' => $task->title];
                    // $this->marktask($data);
                }
            } else if (str_contains($tag, 'requirements approval') == true) {

                $requirement_approval = [
                    'call 1 - requirements approval (done)',
                    'call 2 - requirements approval (done)',
                    'follow up call - requirements approval (done)',
                    'timeline - requirements approval (done)',
                    'pre publish - requirements approval (done)',
                    'pre interview - requirements approval (done)',
                    '1 hour update 1 - requirements approval (done)',
                    '1 hour update 2 - requirements approval (done)',
                    '1 hour update 3 - requirements approval (done)',
                    '1 hour update 4 - requirements approval (done)',
                    '1 hour update 5 - requirements approval (done)',
                    '1 hour update 6 - requirements approval (done)',

                ];

                if (in_array($tag, $requirement_approval)) {

                    // $this->remove_tag($tag);
                    // $removeTag = ['user_id' => $user->id, 'tag' => $tag];
                    // $this->remove_tag($removeTag);
                    // $task = $this->get_task_details('Waiting For Approval');

                    // $check_for_book_app_task = $this->get_task_details('Book Appointment');
                    // if (!collect($check_for_book_app_task)->isEmpty()) {
                    //     $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $check_for_book_app_task->id];
                    //     $this->marktask($task_data);
                    // }

                    // if (!collect($task)->isEmpty()) {
                    //     // $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $task->id];
                    //     // $this->marktask($task_data);

                    //     $data = ['ghl_id' => $user->id, 'task_id' => $task->title];
                    //     $this->marktask($data);
                    // }
                }
            } else  if (str_contains($tag, 'product purchase (done)') == true) {
                $task = $this->get_task_details('Product Purchase');

                // $upload_application = $this->get_task_details('Upload Application');
                if (!collect($task)->isEmpty()) {
                    // $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $task->id];
                    // $this->marktask($task_data);
                    // $data = ['ghl_id' => $user->id, 'task_id' => $task->title];
                    // $this->marktask($data);
                }
            } else if (str_contains($tag, '(current task)') == true) {
                if (str_contains($tag, 'upload requirements') == true) {
                    $current_task_tag[] = $tag;
                } else if (str_contains($tag, 'appointment cancelled (current task)') || str_contains($tag, 'appointment reschedule (current task)') || str_contains($tag, '1 hour update cancelled (current task)') ||  str_contains($tag, '1 hour update reschedule (current task)')) {

                    // $this->cancel_all_task(); jepril 10/04/2023
                    if ($tag == 'appointment cancelled (current task)') {
                        $params = [
                            'appointment cancelled (done)',
                        ];
                        $removeTag = 'appointment cancelled (current task)';
                    } else if ($tag == '1 hour update cancelled (current task)') {
                        $params = [
                            '1 hour update cancelled (done)',
                        ];
                        $removeTag = '1 hour update cancelled (current task)';
                    } else if ($tag == '1 hour update reschedule (current task)') {

                        $params = [
                            '1 hour update reschedule (done)',
                        ];
                        $removeTag = '1 hour update reschedule (current task)';
                    } else if ('appointment reschedule (current task)') {
                        $params = [
                            'appointment reschedule (done)',
                        ];
                        $removeTag = 'appointment reschedule (current task)';
                    } else {

                        \Log::info("error: " . $tag);
                    }

                    if ($params) {
                        $removeTagData = ['user_id' => $user->id, 'tag' => [$removeTag]];
                        // $this->remove_tag($removeTagData);
                        // $removeTag = $this->remove_tag($removeTag);
                        // $data = (object) [];
                        // $data->tag = $params;
                        // $tagAdded = $this->add_tag($data);
                        $tagAdded = ['user_id' => $user->id, 'tag' => $params];
                        // $this->add_new_tag($tagAdded);
                    }
                } else {
                    $current_task_tag[] = $tag;
                }
            } else if (str_contains($tag, 'qualified and completed') == true) {
                $task = $this->get_task_details('Waiting For Approval');
                $book_task = $this->get_task_details('Book Appointment');

                if (!collect($task)->isEmpty()) {
                    // $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $task->id];
                    // $this->marktask($task_data);
                    $data = ['ghl_id' => $user->id, 'task_id' => $task->title];
                    // $this->marktask($data);
                }

                if (!collect($book_task)->isEmpty()) {
                    // $task_data = ['ghl_id' => $user->go_high_level_id, 'task_id' => $book_task->id];
                    // $this->marktask($task_data);
                    $task_data = ['ghl_id' => $user->id, 'task_id' => $book_task->title];
                    // $this->marktask($task_data);
                }
                return $tag;
            } else {
                $current_task_tag[] = $tag;
            }
        }

        // echo json_encode($current_task_tag);
        if (!is_array($current_task_tag)) {
            $current_task_tag = $current_task_tag[0];
        } else {
            if (is_array($current_task_tag)) {

                $uploadreq_task = false;

                foreach ($current_task_tag as $key => $value) {

                    if (str_contains($value, 'upload requirements') == true && str_contains($value, 'current task') == true) {
                        $uploadreq_task = [];
                        $uploadreq_task[] = $value;
                    } else if (str_contains($value, 'book') == true && str_contains($value, 'current task')) {
                        $uploadreq_task = [];
                        $uploadreq_task[] = $value;
                    } else if (str_contains($value, 'upload documents') == true && str_contains($value, 'current task') == true) {

                        $uploadreq_task = $value;
                    }
                }

                if ($uploadreq_task != false) {
                    $current_task_tag = $uploadreq_task;
                }
            }
        }
        // echo $current_task_tag;
        return $current_task_tag;
    }




    public function edit_tag($new_tag)
    {
        $user = auth()->user();

        $params = [
            'email' => $user->email,
            'tags' => [$new_tag]
        ];

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
        $response = Curl::to($url)
            ->withData(json_encode($params))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->put();

        return $response;
    }

    public function add_progress_timeline($user_id) {
        $progress_timeline_data = [
            [
                'name' => "App Analysis",
                'status' => "process"
            ],
            [
                'name' => "Client Stage",
                'status' => "wait"
            ],
            [
                'name' => "Appointment Stage",
                'status' => "wait"
            ],
            [
                'name' => "Docs for Evaluation",
                'status' => "wait"
            ],
            [
                'name' => "Publish",
                'status' => "wait"
            ],
            [
                'name' => "Completed",
                'status' => "wait"
            ],
        ];

        foreach ($progress_timeline_data as $key => $task) {
            \App\UserProgressTimeline::create([
                'user_id'=> $user_id,
                'name'=> $task['name'],
                'status'=> $task['status'],
            ]);
        }

        $appointment_stage_data = [
            [
                'name' => "Call 1",
                'status' => "process"
            ],
            [
                'name' => "Call 2",
                'status' => "wait"
            ],
            [
                'name' => "Follow Up Call (Optional)",
                'status' => "wait"
            ],
            [
                'name' => "Timeline",
                'status' => "wait"
            ],
            [
                'name' => "Pre-Publish",
                'status' => "wait"
            ],
            [
                'name' => "One Hour Update",
                'status' => "wait"
            ],
            [
                'name' => "Pre-Interview",
                'status' => "wait"
            ],
        ];

        foreach ($appointment_stage_data as $key => $task) {
            \App\UserAppointmentProgress::create([
                'user_id'=> $user_id,
                'name'=> $task['name'],
                'status'=> $task['status'],
            ]);
        }
    }

    public function add_task($data) {
        if (is_array($data)) {
            foreach ($data as $key => $task) {
                \App\UserTask::create([
                    'user_id'=> $task['user_id'],
                    'title'=> $task['title'],
                    'description'=> $task['description'],
                    'status'=> $task['status'],
                ]);
            }
        }
    }

    public function add_tag($data)
    {
        $user = auth()->user();
        if ($user->role == "Consultant" || $user->role == "Admin") {
            $get_user = \App\ConsultantSchedule::where('ghl_appointment_id', $data->app_id)->first();
            $ghl_id = \App\User::where('id', $get_user->booked_by)->first();
            $ghl_id =  $ghl_id->go_high_level_id;
        } else {
            $ghl_id = $user->go_high_level_id;
        }

        if (isset($data->tag)) {
            if (is_array($data->tag)) {
                $params = [
                    'tags' => $data->tag,
                ];
            } else {
                $params = [
                    'tags' => [$data->tag],
                ];
            }
        }

        // $ghl_url = 'https://rest.gohighlevel.com/v1/contacts/' .  $ghl_id . '/tags/';
        // $response = Curl::to($ghl_url)
        //     ->withData(json_encode($params))
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->post();

        // return $response->status;
    }


    public function add_new_tag($data)
    {
        if (is_array($data['tag'])) {
            foreach ($data['tag'] as $key => $tag) {
                if (isset($tag)) {
                    \App\UserTag::create([
                        'user_id'=> $data['user_id'],
                        'tag'=> $tag,
                    ]);
                }
            }
        }
        // $user = \App\User::where('email', $data['email'])->first();

        // if (is_array($data['tag'])) {
        //     $params = [
        //         'tags' => $data['tag'],
        //     ];
        // } else {
        //     $params = [
        //         'tags' => [$data['tag']],
        //     ];
        // }


        // $ghl_url = 'https://rest.gohighlevel.com/v1/contacts/' .  $user->go_high_level_id . '/tags/';
        // $response = Curl::to($ghl_url)
        //     ->withData(json_encode($params))
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->post();

        // return $response->status;
    }


    public function remove_tag($data)
    {
        if (is_array($data['tag'])) {
            foreach ($data['tag'] as $key => $tag) {
                if (isset($tag)) {
                    \App\UserTag::where('user_id', $data['user_id'])->where('tag', $tag)->delete();
                }
            }
        }
        // $user = auth()->user();

        // if (is_array($tag)) {
        //     $params = [
        //         'tags' => $tag
        //     ];
        // } else {

        //     $params = [
        //         'tags' => [$tag]
        //     ];
        // }

        // $ghl_url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tags/';
        // $response = Curl::to($ghl_url)
        //     ->withData(json_encode($params))
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->delete();

        // return $response->status;
    }

    public function ghl_change_appointment_status($data)
    {
        $user = auth()->user();

        $status = $data->status;
        $client_id = $data->client_id;
        $consultant_id = $data->consultant_id;
        $id = $data->id;

        // if (isset($data->status)) {
        //     switch ($data->status) {
        //         case 'Showed':
        //             $status = "showed";
        //             break;
        //         case 'No Show':
        //             $status = "noshow";
        //             break;
        //         case 'Cancelled':
        //             $status = "cancelled";
        //             break;

        //         default:
        //             $status = $data->status;
        //             break;
        //     }
        // } else {
        //     $status = "cancelled";
        // }

        // if ($status == "cancelled") {
        //     if ($user->role == "Consultant" || $user->role == "Admin") {
        //         $tag_data =  (object) [];
        //         $tag_data->app_id = $data->id;
        //         $tag_data->tag = 'cancelled by consultant';
        //         $apiresponse = $this->add_tag($tag_data);
        //     } else {
        //         $tag_data =  (object) [];
        //         $tag_data->tag = 'cancelled by client';
        //         $this->add_tag($tag_data);
        //     }

        //     $schedule = \App\ConsultantSchedule::where('ghl_appointment_id', $data->id)->first();

        //     $schedule->update([
        //         'status' => 'cancelled',
        //         'notification_status' => 'new',
        //         'cancelled_at' => \Carbon\Carbon::now()->format('Y-m-d H:i:s'),
        //         'cancelled_by' => $user->role
        //     ]);
        // }

        // $url = 'https://rest.gohighlevel.com/v1/appointments/' . $data->id . '/status';
        // $response = Curl::to($url)
        //     ->withData(json_encode(["status" => $status]))
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->put();

        // if ($status == 'showed' || $status == 'noshow') {
        $schedule = \App\ConsultantSchedule::where('id', $data->id)->first();
        $get_appointment_progress = \App\UserAppointmentProgress::where('user_id', $client_id)->where('status', 'process')->first();

        switch ($status) {
            case 'showed':
                $task = $this->get_task_details(['id' => $data->client_id, 'query' => 'Consultation Call']);
                if (!collect($task)->isEmpty()) {
                    $task_data = ['ghl_id' => $data->client_id, 'task_id' => 'Consultation Call'];
                    $this->marktask($task_data);

                    $update_consultation_call = [
                        'user_id' => $data->client_id,
                        'task_title' => 'Consultation Call',
                    ];
                    $this->update_consultation_call($update_consultation_call);
                }

                $schedule->update([
                    'status' => $status,
                ]);
                break;

            case 'cancelled' || 'noshow' || 'cancelled and delete':
                $add_tag_data = [
                    'appointment cancelled (done)',
                    'book for reschedule',
                ];

                if ($get_appointment_progress->name == 'Call 1') {
                    // remove tags
                    $remove_tag_data = [
                        'book for call 1',
                        'call 1 - call (done)',
                        'call 1 - book (done)',
                        'call 1 - call (current task)',
                    ];

                    // add tags
                    if ($status == 'cancelled' || $status == 'cancelled and delete') {
                        array_push($add_tag_data, 'cancels on call 1', 'call 1 - reschedule book (current task)');
                    } elseif ($status == 'noshow') {
                        array_push($add_tag_data, 'no show on call 1', 'call 1 - reschedule book (current task)');
                    }
                } else if ($get_appointment_progress->name == 'Call 2') {
                    // remove tags
                    $remove_tag_data = [
                        'book for call 2',
                        'call 2 - call (done)',
                        'call 2 - book (done)',
                        'call 2 - call (current task)',
                    ];

                    // add tags
                    if ($status == 'cancelled' || $status == 'cancelled and delete') {
                        array_push($add_tag_data, 'cancels on call 2', 'call 2 - reschedule book (current task)');
                    } elseif ($status == 'noshow') {
                        array_push($add_tag_data, 'no show on call 2', 'call 2 - reschedule book (current task)');
                    }
                } else if ($get_appointment_progress->name == 'Follow Up Call (Optional)') {
                    // remove tags
                    $remove_tag_data = [
                        'book for follow up call',
                        'follow up call - call (done)',
                        'follow up call - book (done)',
                        'follow up call - call (current task)',
                    ];

                    // add tags
                    if ($status == 'cancelled' || $status == 'cancelled and delete') {
                        array_push($add_tag_data, 'cancels on follow up call', 'follow up call - reschedule book (current task)');
                    } elseif ($status == 'noshow') {
                        array_push($add_tag_data, 'no show on follow up call', 'follow up call - reschedule book (current task)');
                    }
                } else if ($get_appointment_progress->name == 'Timeline') {
                    // remove tags
                    $remove_tag_data = [
                        'book for timeline',
                        'timeline - call (done)',
                        'timeline - book (done)',
                        'timeline - call (current task)',
                    ];

                    // add tags
                    if ($status == 'cancelled' || $status == 'cancelled and delete') {
                        array_push($add_tag_data, 'cancels on timeline', 'timeline - reschedule book (current task)');
                    } elseif ($status == 'noshow') {
                        array_push($add_tag_data, 'no show on timeline', 'timeline - reschedule book (current task)');
                    }
                } else if ($get_appointment_progress->name == 'Pre-Publish') {
                    // remove tags
                    $remove_tag_data = [
                        'book for pre publish',
                        'pre publish - call (done)',
                        'pre publish - book (done)',
                        'pre publish - call (current task)',
                    ];

                    // add tags
                    if ($status == 'cancelled' || $status == 'cancelled and delete') {
                        array_push($add_tag_data, 'cancels on pre publish', 'pre publish - reschedule book (current task)');
                    } elseif ($status == 'noshow') {
                        array_push($add_tag_data, 'no show on pre publish', 'pre publish - reschedule book (current task)');
                    }
                } else if ($get_appointment_progress->name == 'Pre-Interview') {
                    // remove tags
                    $remove_tag_data = [
                        'book for pre interview',
                        'pre interview - call (done)',
                        'pre interview - book (done)',
                        'pre interview - call (current task)',
                    ];

                    // add tags
                    if ($status == 'cancelled' || $status == 'cancelled and delete') {
                        array_push($add_tag_data, 'cancels on pre interview', 'pre interview - reschedule book (current task)');
                    } elseif ($status == 'noshow') {
                        array_push($add_tag_data, 'no show on pre interview', 'pre interview - reschedule book (current task)');
                    }
                }

                if ($user->role == 'Consultant' || $user->role == 'Admin') {
                    if ($status == 'cancelled') {
                        $schedule->update([
                            'status' => NULL,
                            'booked_by' => NULL,
                        ]);
                    } else if ($status == 'cancelled and delete') {
                        $schedule->delete();
                    } else {
                        $schedule->update([
                            'status' => $status,
                        ]);
                    }

                } else {
                    $schedule->update([
                        'status' => NULL,
                        'booked_by' => NULL,
                    ]);
                }

                $get_last_appoitment = \App\UserTask::where('user_id', $client_id)->where('title', 'Book Appointment')->orderBy('created_at', 'desc')->first();
                $get_last_appoitment->update([
                    'status' => 'pending',
                ]);

                $get_last_consultation = \App\UserTask::where('user_id', $client_id)->where('title', 'Consultation Call')->orderBy('created_at', 'desc')->first();
                $get_last_consultation->update([
                    'status' => 'upcoming',
                ]);

                $get_last_stage = \App\UserProgressTimeline::where('user_id', $client_id)->where('status', 'process')->first();
                if ($get_last_stage->name == 'Docs for Evaluation') {
                    $get_last_stage->update([
                        'status' => 'wait',
                    ]);

                    $get_appointment_stage = \App\UserProgressTimeline::where('user_id', $client_id)->where('name', 'Appointment Stage')->first();
                    $get_appointment_stage->update([
                        'status' => 'process',
                    ]);
                }

                // remove tags
                $removeTag = [
                    'reschedule - book (done)',
                ];
                $removeTag = array_merge($removeTag, $remove_tag_data);
                $remove_tag = [
                    'user_id' => $client_id,
                    'tag' => $removeTag
                ];
                $this->remove_tag($remove_tag);

                // add tags
                $addTag = [
                    // 'call 1 - book (done)',
                    // 'call 1 - call (current task)',
                    'reschedule - book (done)',
                ];

                $addTag = [];
                $addTag = array_merge($addTag, $add_tag_data);
                $add_tag = [
                    'user_id' => $client_id,
                    'tag' => $addTag
                ];
                $this->add_new_tag($add_tag);
                break;

            default:
                break;
        }


        return $schedule;
    }

    public function update_consultation_call($data)  {
        $current_tag = \App\UserTag::where('user_id', $data['user_id'])->pluck('tag')->toArray();
        $current_tag = json_encode($current_tag);
        switch ($current_tag) {
            case ((str_contains($current_tag, 'call 1 - call (current task)'))): //call 1
                $remove_tag = ['call 1 - book (done)', 'call 1 - call (current task)'];
                $add_tag = ['book for call 2', 'call 1 - call (done)', 'call 2 - book (current task)'];

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'process' => 'Appointment Stage',
                    'wait' => 'Docs for Evaluation',
                ];
                $this->update_progress_timeline_consultation($update_progress_timeline_consultation);

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Call 1'
                ];
                $this->update_appointment_progress($update_progress_timeline_consultation);

                break;

            case ((str_contains($current_tag, 'call 2 - call (current task)'))): //call 2
                $remove_tag = ['call 2 - book (done)', 'call 2 - call (current task)', 'reschedule - book (done)'];
                $add_tag = ['call 2 - call (done)', 'book for follow up call', 'follow up call - book (current task)'];

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'process' => 'Appointment Stage',
                    'wait' => 'Docs for Evaluation',
                ];
                $this->update_progress_timeline_consultation($update_progress_timeline_consultation);

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Call 2'
                ];
                $this->update_appointment_progress($update_progress_timeline_consultation);

                break;

            case ((str_contains($current_tag, 'follow up call - call (current task)'))): // follow-up call
                $remove_tag = [
                    'book for follow up call',
                    'book for reschedule',
                    'follow up call - book (done)',
                    'follow up call - call (current task)',
                    'cancels on follow up call',
                    'no show on follow up call',
                    'follow up call - reschedule book (current task)',
                ];
                $add_tag = ['timeline - book (current task)', 'book for timeline', 'follow up call - call (done)'];

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'process' => 'Appointment Stage',
                    'wait' => 'Docs for Evaluation',
                ];
                $this->update_progress_timeline_consultation($update_progress_timeline_consultation);

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Follow Up Call (Optional)'
                ];
                $this->update_appointment_progress($update_progress_timeline_consultation);

                break;

            case ((str_contains($current_tag, 'timeline - call (current task)'))): // timeline call
                $remove_tag = ['reschedule - book (done)', 'timeline - book (done)', 'timeline - call (current task)'];
                $add_tag = ['pre publish - book (current task)', 'book for pre publish', 'timeline - call (done)'];

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'process' => 'Appointment Stage',
                    'wait' => 'Docs for Evaluation',
                ];
                $this->update_progress_timeline_consultation($update_progress_timeline_consultation);

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Timeline'
                ];
                $this->update_appointment_progress($update_progress_timeline_consultation);

                break;

            case ((str_contains($current_tag, 'pre publish - call (current task)'))): // pre publish call
                $remove_tag = ['pre publish - book (done)', 'pre publish - call (current task)', 'reschedule - book (done)'];
                $add_tag = ['pre publish', 'pre publish - call (done)'];

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Docs for Evaluation',
                ];
                $this->update_progress_timeline($update_progress_timeline_consultation);

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Pre-Publish'
                ];
                $this->update_appointment_progress($update_progress_timeline_consultation);

                break;

            case ((str_contains($current_tag, 'pre interview - call (current task)'))): // pre publish call
                $remove_tag = ['pre interview - book (done)', 'pre interview - call (current task)', 'reschedule - book (done)'];
                $qualified_and_completed = ['pre interview - call (done)', 'qualified and completed', 'pre interview - product offer']; // qualified_and_completed workflow
                $remove_tag = array_merge($remove_tag, $qualified_and_completed);
                $add_tag = ['status'];

                $update_progress_timeline_consultation = [
                    'user_id' => $data['user_id'],
                    'name' => 'Publish',
                ];
                $this->update_progress_timeline($update_progress_timeline_consultation);

                // $update_progress_timeline_consultation = [
                //     'user_id' => $data['user_id'],
                //     'name' => 'Pre-Interview'
                // ];
                // $this->update_appointment_progress($update_progress_timeline_consultation);

                break;

            default:
                return "something went wrong";
        }

        $removeTag = ['reschedule - book (done)'];
        $removeTag = array_merge($removeTag, $remove_tag);

        $removeTagData = ['user_id' => $data['user_id'], 'tag' => $removeTag];
        $this->remove_tag($removeTagData); // remove tag

        $tagAdded = ['user_id' => $data['user_id'], 'tag' => $add_tag];
        $this->add_new_tag($tagAdded); // add tag

        $task_data = [
            [
                'user_id' => $data['user_id'],
                'title' => "Book Appointment",
                'description' => 'Schedule appointment for consultation
                <br/> <a href="'.env('REACT_APP_URL').'appointment/book-a-consultant">Click here</a>',
                'status' => "pending"
            ],
            [
                'user_id' => $data['user_id'],
                'title' => "Consultation Call",
                'description' => "Wait for a consultation call.",
                'status' => "upcoming"
            ],
        ];
        if (!str_contains($current_tag, 'pre publish - call (current task)') && !str_contains($current_tag, 'pre interview - call (current task)')) {
            $this->add_task($task_data);
        }
    }

    public function sync_register_consultant($data)
    {
        $url = 'https://rest.gohighlevel.com/v1/calendars/teams';
        $ApiResponse = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $url = 'https://rest.gohighlevel.com/v1/calendars/services?teamId=' . env('GOHIGHLEVEL_TEAM_CALENDAR_ID');
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $team = json_decode($ApiResponse, true);

        $consultants_calendar = json_decode($response, true)['services'];

        $filtered_array =   collect($consultants_calendar)->map(function ($q) use ($team) {
            $data = [];

            foreach ($team['teams'][0]['members'] as $member) {
                if ($q['name'] == $member['name']) {
                    $data['email'] = $member['email'];
                }
            }

            $data['go_high_level_id'] = $q['id'];
            //$data['name'] = $q['name'];
            $explode_name = explode(" ", $q['name']);
            $firstName = "";
            for ($i = 0; $i <  count($explode_name) - 1; $i++) {
                $firstName = $firstName . " " .  $explode_name[$i];
            }

            $data['firstname'] = $firstName;
            $data['lastname'] = $explode_name[count($explode_name) - 1];
            $data['username'] = $explode_name[0];
            $data['role'] = 'Consultant';
            $data['status'] = 'Active';
            return $data;
            //  return $q;
        });


        foreach ($filtered_array as $consultant_data) {


            $checkEmail = \App\User::where('email', $consultant_data['email'])->count();

            if ($checkEmail == 0) {

                $userCreate = \App\User::create($consultant_data);
                $default = urlencode('https://ui-avatars.com/api/' . $userCreate->firstname . '/100/0D8ABC/fff/2/0/1');
                $img =  'https://www.gravatar.com/avatar/' . md5(strtolower(trim($userCreate->email))) . '?d=' . $default;
                $userCreate->profile_image = $img;
                $userCreate->save();


                if ($userCreate) {
                    $dataUserAddress = [
                        "address1"             => '',
                        "city"                 => '',
                        "state"                => '',
                        // "country"              => $request->country,
                        "zip_code"             => '',
                        "is_primary"           => 1
                    ];
                    $userCreate->user_address()->create($dataUserAddress);


                    $token = $userCreate->createToken('atc')->accessToken;

                    $email_temp1 = explode('+', $consultant_data['email']);
                    $email_temp2 = explode('@', $consultant_data['email']);

                    $email_new = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];
                    $to_name = $consultant_data['firstname'] . " " . $consultant_data['lastname'];

                    $data = [
                        'to_name'       => $to_name,
                        'to_email'      => $email_new,
                        'link_origin'   => $data->link_origin,
                        'token'         => $token,
                        'username'      => $consultant_data['username'],
                        'link'          => $data->link_origin . '/register/setup-password' . '/' . $token,
                    ];
                    $this->setup_email_template(2, $data);
                }
            } else {
                $updated = \App\User::where('email', $consultant_data['email'])->update(
                    $consultant_data
                );
            }
        }

        return true;
    }


    public function cancel_all_task()
    {

        $user = auth()->user();

        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tasks/';
        $response = Curl::to($url)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->get();

        $response = json_decode($response, true);

        $tasks = $response['tasks'];

        $pending_tasks = [];

        foreach ($tasks as $task) {
            if ($task['isCompleted'] !== true && str_contains($task['title'], 'Book Appointment') == false) {
                array_push($pending_tasks, $task);
            }
        }


        foreach ($pending_tasks as $pending_task) {

            $url1 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/tasks/' . $pending_task['id'];
            $apiResp = Curl::to($url1)
                ->withHeader('Content-Type: application/json')
                ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
                ->delete();
        }

        return  $pending_tasks;
    }


    public function add_user_note($postData)
    {


        $user = \App\User::where('id', '<>', 0)->where('id', $postData->id)->orWhere('go_high_level_id', $postData->id)->first();

        $data = [
            "body" => $postData->note
        ];

        $url1 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/notes/';
        $apiResp = Curl::to($url1)
            ->withData(json_encode($data))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->post();


        return  $apiResp;
    }


    public function delete_user_note($postData)
    {

        $user = \App\User::where('id', '<>', 0)->where('id', $postData->id)->orWhere('go_high_level_id', $postData->id)->first();

        $url1 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/notes/' . $postData->note_id;
        $apiResp = Curl::to($url1)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->delete();


        return  $apiResp;
    }

    public function get_user_note($id)
    {


        if (is_numeric($id)) {

            $user = \App\User::where('id', $id)->first();
        } else {

            $user = \App\User::where('go_high_level_id', $id)->first();
        }


        $url1 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id . '/notes/';
        $apiResp = Curl::to($url1)
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->get();

        if ($apiResp->status == 200) {
            return response()->json([
                'success' => true,
                'data' => json_decode($apiResp->content)->notes
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Something went wrong while fetching user notes'
            ]);
        }
    }

    public function add_selected_tag(Request $request)
    {
        // $data = (object) [];
        // $data->tag = ['selected client'];
        // $hasAdded = $this->add_tag($data);


        $remove_tag = [
            'user_id' => $request->user_id,
            'tag' => [
                '1 hour update',
                '1 hour update 1 - upload requirements (done)',
                '1 hour update 2 - upload requirements (done)',
                '1 hour update 3 - upload requirements (done)',
                '1 hour update 4 - upload requirements (done)',
                '1 hour update 5 - upload requirements (done)',
                '1 hour update 6 - upload requirements (done)',
                'pre publish',
                'pre publish - call (done)',
                'selected client',
            ]
        ];
        $this->remove_tag($remove_tag); // remove tags

        $add_tag =[
            'user_id' => $request->user_id,
            'tag' => [
                'book for pre interview',
                'pre interview - book (current task)',
                'pre interview - product offer ',
            ]
        ];
        $this->add_new_tag($add_tag); // add tags

        $update_appointment_progress = [
            'user_id' => $request->user_id,
            'name' => 'One Hour Update'
        ];
        $this->update_appointment_progress($update_appointment_progress); // update appointment progress

        $task_data = [
            [
                'user_id' => $request->user_id,
                'title' => "Book Appointment",
                'description' => 'Schedule appointment for consultation
                <br/> <a href="'.env('REACT_APP_URL').'appointment/book-a-consultant">Click here</a>',
                'status' => "pending"
            ],
            [
                'user_id' => $request->user_id,
                'title' => "Consultation Call",
                'description' => "Wait for a consultation call.",
                'status' => "upcoming"
            ],
        ];
        $this->add_task($task_data);

        return response()->json([
            'success' => true,
            'message' => 'Consultant has been notified!',
            'request' => $request->all()
        ], 200);

        // if ($hasAdded == 200) {
        // } else {
        //     return response()->json(['success' => false, 'message' => 'Something went wrong!']);
        // }
    }

    public function send_sms_notification($data)
    {

        $accessToken = \App\GHLAuth::orderBy('id', 'desc')->limit(1)->first();
        $accessToken = json_decode($accessToken['accessToken'], true);

        $accessToken =  $accessToken['access_token'];

        $link = env("REACT_APP_URL") . "/email/notification/autologin/" . $data['token'] . "/" . $data['appointment_id'];

        $link = $this->shorten_url($link);

        $default_template = \App\AdminNotificationSettings::first();
        $template = \App\EmailTemplate::where('id',  $default_template->sms_template)->first();


        if ($template) {
            $body = $template->body;
        } else {
            $body =  '<p>Dear <b>[contact_name]</b>,</p><p>A new slot for consultation is open. Here is the consultation slot details:</p></br><p>Date: [date]</p><p>Time start: [time_start]</p><p>Time end: [time_end]</p></br><p>tap the link below to book appointment now!</p> <br/><p>[link]</p></br><p>This is a first come, first serve appointment. Which means that if the link above doesnt work, a client has already booked the appointment.</p><br/><p>If you need assistance or have questions, please contact Courtney at courtney@airlinetc.com. </p></br><p>Thank you,</p></br><p>Airline Transition Consultants</p>';
        }

        $body = str_replace('[contact_name]', $data['contact_name'], $body);
        $body = str_replace('[date]', Carbon::parse($data['schedule_date'])->toFormattedDateString(), $body);
        $body = str_replace('[time_start]', $data['time_start'], $body);
        $body = str_replace('[time_end]', $data['time_end'], $body);
        $body = str_replace('[link]',  $link, $body);


        $params = [
            'type' => 'SMS',
            'contactId' => $data['reciever_id'],
            'message' => $body,
        ];

        $url = 'https://services.leadconnectorhq.com/conversations/messages';
        $ApiResponse = Curl::to($url)
            ->withData(json_encode($params))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer ' .  $accessToken)
            ->withHeader('Version: 2021-04-15')
            ->withResponseHeaders()
            ->post();

        return $ApiResponse;
    }

    public function shorten_url($data)
    {
        $params = [
            'long_url' => $data,
            'domain' => 'bit.ly',
        ];

        $url = 'https://api-ssl.bitly.com/v4/shorten';
        $ApiResponse = Curl::to($url)
            ->withData(json_encode($params))
            ->withHeader('Content-Type: application/json')
            ->withHeader('Authorization: Bearer c2355512bb7934509bab9aca8f6d549804d6bba8')
            ->post();

        $return_link = json_decode($ApiResponse, true);

        return $return_link['link'];
    }

    public function send_new_email_notification($data)
    {

        $date = $data['schedule_date'];
        $timeStart = $data['time_start'];
        $timeEnd = $data['time_end'];
        $consultant = $data['consultant'];

        $default_template = \App\AdminNotificationSettings::first();
        $email_template = \App\EmailTemplate::where('id', $default_template->email_template)->first();

        $body = $email_template->body;

        $link = env("REACT_APP_URL") . "/email/notification/autologin/" . $data['token'] . "/" . $data['appointment_id'];

        $to_name = isset($data['contact']->firstname) ? $data['contact']->firstname . " " . $data['contact']->lastname : $data['contact']->name;
        $subject = $data['subject'] ? $data['subject'] : "Appointment Availability Notice";


        $body = str_replace('[user:display-name]', $to_name, $body);
        $body = str_replace('[consultant:display-name]', $consultant, $body);
        $body = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body);
        $body = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body);
        $body = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body);
        $body = str_replace('<p><br></p>', "", $body);


        $email_temp1 = explode('+', $data['contact']->contact->email);
        $email_temp2 = explode('@', $data['contact']->contact->email);

        $to_email = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];


        $data_email = [
            'to_name'       =>  $to_name,
            'to_email'      =>  $to_email,
            'subject'       =>  $subject,
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template'      => "admin.emails.email-appointment-availability-notification",
            'body_data'     => [
                "content" => $body,
                "name" =>  $to_name,
                "link" =>  $link,
                "date" =>  Carbon::parse($date)->toFormattedDateString(),
                "timeStart" => $timeStart,
                "timeEnd" => $timeEnd,
                "consultant" => $consultant
            ]
        ];

        event(new \App\Events\SendMailEvent($data_email));
    }


    //send email notification to admin when client has cancelled 90 mins below
    public function send_new_admin_email_notification($data)
    {

        $date = $data['schedule_date'];
        $timeStart = $data['time_start'];
        $timeEnd = $data['time_end'];
        $consultant = $data['consultant'];

        // $default_template = \App\AdminNotificationSettings::first();
        $email_template = \App\EmailTemplate::where('title',  'APPOINTMENT CANCELLATION NOTIFICATION FOR ADMIN')->first();


        //get admin email
        $admin = \App\User::select('firstname', 'lastname', 'email')->where('role', 'admin')->first();


        $body = $email_template->body;

        // $link = env("REACT_APP_URL") . "/email/notification/autologin/" . $data['token'] . "/" . $data['appointment_id'];

        $to_name = isset($admin->firstname) ? $admin->firstname . " " . $admin->lastname : 'Admin';
        $subject = $data['subject'] ? $data['subject'] : "Appointment Availability Notice";


        $body = str_replace('[user:display-name]', $to_name, $body);
        $body = str_replace('[consultant:display-name]', $consultant, $body);
        $body = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body);
        $body = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body);
        $body = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body);
        $body = str_replace('<p><br></p>', "", $body);


        $email_temp1 = explode('+', $admin->email);
        $email_temp2 = explode('@', $admin->email);

        $to_email = count($email_temp1) == 2 ? $email_temp1[0] . "@" . $email_temp2[1] : $email_temp1[0];


        $data_email = [
            'to_name'       =>  $to_name,
            'to_email'      =>  $to_email,
            'subject'       =>  $subject,
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template'      => "admin.emails.email-appointment-availability-notification-admin",
            'body_data'     => [
                "content" => $body,
                "name" =>  $to_name,
                // "link" =>  $link,
                "date" =>  Carbon::parse($date)->toFormattedDateString(),
                "timeStart" => $timeStart,
                "timeEnd" => $timeEnd,
                "consultant" => $consultant
            ]
        ];

        event(new \App\Events\SendMailEvent($data_email));
    }

    //send email notification to admin when no replacement for the reopened slot
    public function send_no_replacement_notice($consultant, $data)
    {

        $date = $data['schedule_date'];
        $timeStart = $data['time_start'];
        $timeEnd = $data['time_end'];
        // $consultant = $data['consultant'];

        // $default_template = \App\AdminNotificationSettings::first();
        $email_template = \App\EmailTemplate::where('title',  'NO REPLACEMENT FOR APPOINTMENT NOTICE')->first();


        //get admin email
        $admin = \App\User::select('firstname', 'lastname', 'email')->where('role', 'admin')->first();


        $body = $email_template->body;
        $body_consultant = $email_template->body;

        // $link = env("REACT_APP_URL") . "/email/notification/autologin/" . $data['token'] . "/" . $data['appointment_id'];

        $to_name = isset($admin->firstname) ? $admin->firstname . " " . $admin->lastname : 'Admin';
        $subject = $data['subject'] ? $data['subject'] : "Appointment Availability Notice";


        $body = str_replace('[user:display-name]', $to_name, $body);
        $body = str_replace('[consultant:display-name]', $consultant['name'], $body);
        $body = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body);
        $body = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body);
        $body = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body);
        $body = str_replace('<p><br></p>', "", $body);


        $body_consultant = str_replace('[user:display-name]', $consultant['name'], $body_consultant);
        $body_consultant = str_replace('[consultant:display-name]', $consultant['name'], $body_consultant);
        $body_consultant = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body_consultant);
        $body_consultant = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body_consultant);
        $body_consultant = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body_consultant);
        $body_consultant = str_replace('<p><br></p>', "", $body_consultant);


        $email_temp1_admin = explode('+', $admin->email);
        $email_temp2_admin = explode('@', $admin->email);

        $to_email_admin = count($email_temp1_admin) == 2 ? $email_temp1_admin[0] . "@" . $email_temp2_admin[1] : $email_temp1_admin[0];


        $email_temp1_consultant = explode('+', $consultant['email']);
        $email_temp2_consultant = explode('@', $consultant['email']);

        $to_email_consultant = count($email_temp1_consultant) == 2 ? $email_temp1_consultant[0] . "@" . $email_temp2_consultant[1] : $email_temp1_consultant[0];


        //data to be send to admin
        $data_email_admin = [
            'to_name'       =>  $to_name,
            'to_email'      =>  $to_email_admin,
            'subject'       =>  $subject,
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template'      => "admin.emails.email-appointment-availability-notification-admin",
            'body_data'     => [
                "content" => $body,
                "name" =>  $to_name,
                "title" => "NO REPLACEMENT FOR APPOINTMENT NOTICE",
                // "link" =>  $link,
                "date" =>  Carbon::parse($date)->toFormattedDateString(),
                "timeStart" => $timeStart,
                "timeEnd" => $timeEnd,
                "consultant" => $consultant
            ]
        ];


        //data to be send to consultant
        $data_email_consultant = [
            'to_name'       =>  $consultant['name'],
            'to_email'      =>  $to_email_consultant,
            'subject'       =>  $subject,
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template'      => "admin.emails.email-appointment-availability-notification-admin",
            'body_data'     => [
                "content" => $body_consultant,
                "name" =>  $consultant['name'],
                "title" => "NO REPLACEMENT FOR APPOINTMENT NOTICE",
                // "link" =>  $link,
                "date" =>  Carbon::parse($date)->toFormattedDateString(),
                "timeStart" => $timeStart,
                "timeEnd" => $timeEnd,
                "consultant" => $consultant
            ]
        ];

        event(new \App\Events\SendMailEvent($data_email_admin));
        event(new \App\Events\SendMailEvent($data_email_consultant));
    }

    public function send_ninety_minute_reminder($consultant, $data)
    {

        $date = $data['schedule_date'];
        $timeStart = $data['time_start'];
        $timeEnd = $data['time_end'];
        // $consultant = $data['consultant'];

        // $default_template = \App\AdminNotificationSettings::first();
        $email_template = \App\EmailTemplate::where('title',  'AVAILABILITY NOTICE FOR ADMIN')->first();


        //get admin email
        $admin = \App\User::select('firstname', 'lastname', 'email')->where('role', 'admin')->first();


        $body = $email_template->body;
        $body_consultant = $email_template->body;

        // $link = env("REACT_APP_URL") . "/email/notification/autologin/" . $data['token'] . "/" . $data['appointment_id'];

        $to_name = isset($admin->firstname) ? $admin->firstname . " " . $admin->lastname : 'Admin';
        $subject = $data['subject'] ? $data['subject'] : "Appointment Availability Notice";


        $body = str_replace('[user:display-name]', $to_name, $body);
        $body = str_replace('[consultant:display-name]', $consultant['name'], $body);
        $body = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body);
        $body = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body);
        $body = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body);
        $body = str_replace('<p><br></p>', "", $body);

        $body_consultant = str_replace('[user:display-name]', $consultant['name'], $body_consultant);
        $body_consultant = str_replace('[consultant:display-name]', $consultant['name'], $body_consultant);
        $body_consultant = str_replace('[time-start:apppoitment-time-start]', $timeStart, $body_consultant);
        $body_consultant = str_replace('[time-end:apppoitment-time-end]', $timeEnd, $body_consultant);
        $body_consultant = str_replace('[date:appoitment-date]', Carbon::parse($date)->toFormattedDateString(), $body_consultant);
        $body_consultant = str_replace('<p><br></p>', "", $body_consultant);

        $email_temp1_admin = explode('+', $admin->email);
        $email_temp2_admin = explode('@', $admin->email);

        $to_email_admin = count($email_temp1_admin) == 2 ? $email_temp1_admin[0] . "@" . $email_temp2_admin[1] : $email_temp1_admin[0];


        $email_temp1_consultant = explode('+', $consultant['email']);
        $email_temp2_consultant = explode('@', $consultant['email']);

        $to_email_consultant = count($email_temp1_consultant) == 2 ? $email_temp1_consultant[0] . "@" . $email_temp2_consultant[1] : $email_temp1_consultant[0];


        //data to be send to admin
        $data_email_admin = [
            'to_name'       =>  $to_name,
            'to_email'      =>  $to_email_admin,
            'subject'       =>  $subject,
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template'      => "admin.emails.email-appointment-availability-notification-admin",
            'body_data'     => [
                "content" => $body,
                "name" =>  $to_name,
                "title" => "SLOT IS STILL AVAILABLE REMINDER",
                // "link" =>  $link,
                "date" =>  Carbon::parse($date)->toFormattedDateString(),
                "timeStart" => $timeStart,
                "timeEnd" => $timeEnd,
                "consultant" => $consultant
            ]
        ];

        //data to be send to consultant
        $data_email_consultant = [
            'to_name'       =>  $consultant['name'],
            'to_email'      =>  $to_email_consultant,
            'subject'       =>  $subject,
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template'      => "admin.emails.email-appointment-availability-notification-admin",
            'body_data'     => [
                "content" => $body_consultant,
                "name" =>  $consultant['name'],
                "title" => "SLOT IS STILL AVAILABLE REMINDER",
                // "link" =>  $link,
                "date" =>  Carbon::parse($date)->toFormattedDateString(),
                "timeStart" => $timeStart,
                "timeEnd" => $timeEnd,
                "consultant" => $consultant
            ]
        ];

        event(new \App\Events\SendMailEvent($data_email_admin));
        event(new \App\Events\SendMailEvent($data_email_consultant));
    }

    public function send_email_for_token()
    {

        $data_email = [
            'to_name'       => 'email@5pints',
            'to_email'      =>  ['it@fivepints.com', 'shaitzz@gmail.com'],
            'subject'       =>  'refresh go high level token',
            'from_name'     => "Airline Transition Consultatant",
            'from_email'    => "no-reply@airlinetc.com",
            'template' => [],
            'body_data'     => [],
            'raw_body'     => [
                "content" => 'Please refresh go high level token ',
            ]
        ];

        event(new \App\Events\SendMailEvent($data_email));
    }

    public function submit_docusign(Request $request)
    {
        $current_tag = $this->get_current_tag();
        if (is_array($current_tag)) {
            $current_tag = json_encode($current_tag);
        }

        //   if (str_contains($current_tag, 'docusign (current task)')) {
        $admin = \App\User::select('email')->where('role', 'Admin')->get();

        $user = \App\User::find($request->user_id);
        $user->has_agreed_mnda = true;
        $user->save();

        // $params = [
        //     'email' =>  $user->email,
        //     'customField' => ['F5XwSK6mYtyb6RKOnbDi' =>  $request->link]
        // ];

        // $params = json_encode($params);
        // $params = str_replace("[", "", $params);
        // $params = str_replace("]", "", $params);



        // $url3 = 'https://rest.gohighlevel.com/v1/contacts/' . $user->go_high_level_id;
        // $response = Curl::to($url3)
        //     ->withData($params)
        //     ->withHeader('Content-Type: application/json')
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseObject()
        //     ->put();


        // if ($response->status != 200) {
        //     return response()->json(['success' => false, 'message' => 'Failed to submit MNDA. please try again!']);
        // }

        // $data = (object) [];
        // $data->tag = ['docusign (done)'];
        // $hasAdded = $this->add_tag($data);


        $add_tag_data = [
            'user_id' => $user->id,
            'tag' => ['docusign (done)', 'book for call 1', 'call 1 - book (current task)']
        ];
        $this->add_new_tag($add_tag_data);

        $remove_tag_data = [
            'user_id' => $user->id,
            'tag' => ['product purchase (done)', 'docusign (current task)']
        ];
        $this->remove_tag($remove_tag_data);

        $task = $this->get_task_details(['query' => 'MNDA', 'id' => $user->id]);

        if (isset($task) && !collect($task)->isEmpty()) {
            $data = ['ghl_id' => $user->id, 'task_id' => "MNDA"];
            $this->marktask($data);

            $task_data = ['user_id' => $user->id, 'name' => "Client Stage"];
            $this->update_progress_timeline($task_data);
        }

        // $subject = "Completed: Mutual Confedential Agreement";

        // $emailData = array(
        //     'to_name' => $user->firstname . ' ' . $user->lastname,
        //     'to_email' => $user->email,
        //     'subject' => $subject,
        //     'from_name' =>  env('MIX_APP_NAME') . ' Support',
        //     'from_email' => 'no-reply@system.airlinetc.com', // no-reply@apmloanstatus.com
        //     'template' => 'admin.emails.email-docusign',
        //     'body_data'     => [
        //         "content" => [],
        //         "name" => $user->firstname . ' ' . $user->lastname,
        //     ],
        //     'attachment' => [
        //         'url' => $request->link,
        //         'as' => 'ATC-MDA.pdf'
        //     ]
        // );
        // event(new \App\Events\SendMailEvent($emailData));



        return response()->json(['success' => true, 'message' => 'MNDA successfully submitted!']);
    }
    //  }

    public function save_uploaded_files($data)
    { }

    public function update_progress_timeline($data) {
        $response = \App\UserProgressTimeline::where('user_id', $data['user_id'])->where('name', $data['name'])->where('status', 'process')->first();
        if (isset($response)) {
            $response->status = 'finish';
            $response->save();
        }

        $responseToProcess = \App\UserProgressTimeline::where('user_id', $data['user_id'])->where('status', 'wait')->orderBy('id', 'asc')->first();
        if (isset($responseToProcess)) {
            $responseToProcess->status = 'process';
            $responseToProcess->save();
        }

        \Log::info("response:" . json_encode($response));
        if (isset($response)) {
            return json_decode($response);
        } else {
            return false;
        }
    }

    public function update_progress_timeline_consultation($data) {
        $response = \App\UserProgressTimeline::where('user_id', $data['user_id'])->where('name', $data['process'])->first();
        if (isset($response)) {
            $response->status = 'process';
            $response->save();
        }

        $responseToProcess = \App\UserProgressTimeline::where('user_id', $data['user_id'])->where('name', $data['wait'])->first();
        if (isset($responseToProcess)) {
            $responseToProcess->status = 'wait';
            $responseToProcess->save();
        }

        \Log::info("response:" . json_encode($response));
        if (isset($response)) {
            return json_decode($response);
        } else {
            return false;
        }
    }

    public function update_appointment_progress($data) {
        $response = \App\UserAppointmentProgress::where('user_id', $data['user_id'])->where('name', $data['name'])->where('status', 'process')->first();
        if (isset($response)) {
            $response->status = 'finish';
            $response->save();
        }

        $responseToProcess = \App\UserAppointmentProgress::where('user_id', $data['user_id'])->where('status', 'wait')->orderBy('id', 'asc')->first();
        if (isset($responseToProcess)) {
            $responseToProcess->status = 'process';
            $responseToProcess->save();
        }

        \Log::info("response:" . json_encode($response));
        if (isset($response)) {
            return json_decode($response);
        } else {
            return false;
        }

    }

    public function update_appointment_progress_timeline_call($data) {
        $response = \App\UserAppointmentProgress::where('user_id', $data['user_id'])->where('name', $data['finish'])->first();
        if (isset($response)) {
            $response->status = 'finish';
            $response->save();
        }

        $responseToProcess = \App\UserAppointmentProgress::where('user_id', $data['user_id'])->where('name', $data['process'])->first();
        if (isset($responseToProcess)) {
            $responseToProcess->status = 'process';
            $responseToProcess->save();
        }

        \Log::info("response:" . json_encode($response));
        if (isset($response)) {
            return json_decode($response);
        } else {
            return false;
        }

    }

    public function marktask($data)
    {
        //  $user = auth()->user();
        // $url = 'https://rest.gohighlevel.com/v1/contacts/' . $data['ghl_id'] . '/tasks/' . $data['task_id'] . '/status';

        // $response = Curl::to($url)
        //     ->withData(json_encode(['status' => 'completed']))
        //     ->withHeader('Content-Type: application/json')
        //     // ->withHeader('Dropbox-API-Arg: '.$params)
        //     ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
        //     ->returnResponseArray()
        //     ->put();
        $response = \App\UserTask::where('user_id', $data['ghl_id'])->where('title', $data['task_id'])->where('status', 'pending')->first();
        if (isset($response)) {
            $response->status = 'completed';
            $response->save();
        }

        $responseToPending = \App\UserTask::where('user_id', $data['ghl_id'])->where('status', 'upcoming')->first();
        if (isset($responseToPending)) {
            $responseToPending->status = 'pending';
            $responseToPending->save();
        }

        $responseToUpcoming = \App\UserTask::where('user_id', $data['ghl_id'])->where('status', '')->orderBy('id', 'asc')->first();
        if (isset($responseToUpcoming)) {
            $responseToUpcoming->status = 'upcoming';
            $responseToUpcoming->save();
        }

        \Log::info("response:" . json_encode($response));
        if (isset($response)) {
            return json_decode($response);
        } else {
            return false;
        }
    }

    public function unmarktask($data)
    {

        //  $user = auth()->user();
        $url = 'https://rest.gohighlevel.com/v1/contacts/' . $data['ghl_id'] . '/tasks/' . $data['task_id'] . '/status';

        $response = Curl::to($url)
            ->withData(json_encode(['status' => 'incompleted']))
            ->withHeader('Content-Type: application/json')
            // ->withHeader('Dropbox-API-Arg: '.$params)
            ->withHeader('Authorization: Bearer ' . env('GOHIGHLEVEL_API_KEY'))
            ->returnResponseObject()
            ->put();

        return $response->status;
    }

}
