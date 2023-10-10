<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Ddeboer\Imap\Server;


class DashboardController extends Controller
{
    function index()
    {
        return view('admin.app');
    }

    function testing() {
        $server = new Server('imap.gmail.com');

        // $connection is instance of \Ddeboer\Imap\Connection
        $connection = $server->authenticate('joshuasaubon@gmail.com', 'zvouyywlhbfakzpo');
        $mailbox = $connection->getMailbox('INBOX');
        // $messages = $mailbox->getMessages();
        // dd($messages);
        $today = new \DateTimeImmutable();
        $daysAgo = $today->sub(new \DateInterval('P2D'));

        $messages = $mailbox->getMessages(
            new \Ddeboer\Imap\Search\Date\Since($daysAgo),
            \SORTDATE, // Sort criteria
            true // Descending order
        );

        $received_emails = array();
        foreach ($messages as $key => $message) {
            $from = $message->getFrom()->getAddress();

            if(count($message->getTo()) > 0) {
                $to = $message->getTo()[0]->getAddress();
                if($from == 'support@promise.network' || $to == 'support@promise.network') {

                    $subject = $message->getSubject();
                    $body = $this->strip_quotes_from_message($message->getBodyHtml());
                    $date = $message->getDate()->format('Y-m-d H:i:s');
                    $date = date('Y-m-d H:i:s',strtotime($date.' '.$message->getDate()->getTimeZone()->getName()));

                    array_push($received_emails,array(
                        'from' => $from,
                        'to' => $to,
                        'subject' => $subject,
                        'body' => $body,
                        'date' => $date
                    ));
                }
            }

        }

        dd($received_emails);
    }
}
