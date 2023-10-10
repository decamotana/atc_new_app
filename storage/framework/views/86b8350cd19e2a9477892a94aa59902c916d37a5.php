<!DOCTYPE html>
<html lang="<?php echo e(app()->getLocale()); ?>">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="<?php echo e(csrf_token()); ?>">
    <link rel="shortcut icon" type="image/png/ico" href="/assets/apm-icon.png" />
    <!-- <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" rel="stylesheet"/> -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <!-- <script src='https://kit.fontawesome.com/a076d05399.js'></script> -->
    <!-- <link rel="stylesheet" href="<?php echo e(url('/fonts/chequeFont.css')); ?>"> -->

    <style>

        .ant-layout-sider {
            background-color: <?php echo e(env('MIX_NAV_BG_COLOR')); ?> !important;
        }

        aside .ant-menu.ant-menu-light, aside .ant-menu-light .ant-menu-sub, aside .ant-menu.ant-menu-light .ant-menu-sub {
            background-color: <?php echo e(env('MIX_NAV_BG_COLOR')); ?> !important;
        }

        aside .ant-menu.ant-menu-light .ant-menu-item-selected, aside .ant-menu-submenu-popup.ant-menu-light .ant-menu-item-selected {
            background-color: <?php echo e(env('MIX_NAV_HOVER_ACTIVE_COLOR')); ?> !important;
        }

        .PNcolor {
            background-color: <?php echo e(env('MIX_LOGIN_BG_COLOR')); ?> !important;
        }

    </style>
    

</head>
<body>
<div id="app">

</div>

<script src="<?php echo e(mix('js/app.js')); ?>"></script>
</body>
</html>
<?php /**PATH /Users/jeprilachapero/Documents/5PINTS/atc_laravel_app/resources/views/admin/app.blade.php ENDPATH**/ ?>