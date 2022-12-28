import React, { Component, Suspense, useEffect, useState, useRef } from "react";
import Select from "react-select";
import { Content } from "antd/lib/layout/layout";
import {
    Layout,
    Card,
    Row,
    Col,
    Button,
    Form,
    Input,
    InputNumber,
    Space,
    DatePicker,
    Divider,
    notification,
    Checkbox
} from "antd";
import { Link, useLocation, useHistory } from "react-router-dom";

import getUserData from "../../providers/getUserData";
import useAxiosQuery from "../../providers/useAxiosQuery";

const PageInitLogin = () => {
    let history = useHistory();
    const key = "PromiseNetwork@2021";
    const encryptor = require("simple-encryptor")(key);
    const [checkEULA, setCheckEULA] = useState(false);
    const userdata = getUserData();

    const handleFinish = () => {
        if (checkEULA) {
            // setHideInput(true);
            var eula_pdf = $(".eulaToPDF").html();
            mutateEula(
                {
                    id: userdata.id,
                    init_login: 0,
                    eula_pdf: eula_pdf
                },
                {
                    onSuccess: res => {
                        if (res.success) {
                            console.log(res.data);
                            if (res.data.init_login == 0) {
                                let _userData = { ...userdata, ...res.data };
                                localStorage.userdata = encryptor.encrypt(
                                    _userData
                                );
                                notification.success({
                                    message: "EULA Acceptance Submitted"
                                });
                                history.push(
                                    "/boarding/clearent/" + res.data.id
                                );
                            }
                        }
                    }
                }
            );
        }
    };

    const { mutate: mutateEula, isLoading: isLoadingEula } = useAxiosQuery(
        "UPDATE",
        "api/v1/users",
        "users"
    );

    return (
        <Content
            className="site-layout-background"
            style={{
                margin: "24px 16px",
                minHeight: 280,
                background: "transparent"
            }}
        >
            <Row gutter={24}>
                <Col span={6}></Col>
                <Col span={12}>
                    <br />
                    <br />
                    <Card>
                        <div className="eulaToPDF">
                            <h2 className="text-center">EULA</h2>
                            <h3 className="text-center">
                                End User License Agreement (EULA) for POSPay
                                Merchants
                            </h3>
                            <div className="text-center">
                                <small>Version (22012021</small>
                            </div>

                            <hr></hr>
                            <p style={{ textAlign: "justify" }}>
                                THIS END USER LICENSE AGREEMENT (THESE “TERMS OF
                                SERVICE” OR THE “END USER LICENSE AGREEMENT” OR
                                “EULA”) FORMS A BINDING AGREEMENT BETWEEN YOU
                                (“YOU,” “YOUR”) AND PROMISE GROUP, INC.
                                (“PROMISE,” “WE,” “US,” “OUR”) PLEASE READ THESE
                                TERMS OF SERVICE CAREFULLY, BECAUSE BY
                                DOWNLOADING, ACCESSING OR USING ANY PROMISE APP,
                                SOFTWARE, PLATFORM, PRODUCTS AND/OR SERVICES,
                                AND/OR THOSE OF ANY PROMISE AFFILIATED PARTNER
                                (COLLECTIVELY, THE “SERVICES”) YOU ARE
                                ACKNOWLEDGING THAT YOU HAVE READ, UNDERSTOOD AND
                                AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND
                                PROMISE’S PRIVACY STATEMENT (“PRIVACY
                                STATEMENT”). IF YOU DO NOT AGREE TO THESE TERMS
                                OF SERVICE OR PROMISE’S PRIVACY POLICY YOU MAY
                                NOT DOWNLOAD, ACCESS OR USE THE SERVICES.
                                <br />
                                <br />
                                FROM TIME TO TIME WE MAY UPDATE OR MODIFY THESE
                                TERMS OF SERVICE IN OUR DISCRETION, AND WILL
                                NOTIFY YOU OF UPDATED TERMS VIA ELECTRONIC MAIL.
                                WE MAY PROVIDE NOTICE TO YOU OF THE UPDATED
                                TERMS OF SERVICE BY EMAIL, AND/OR AN ON-SCREEN
                                NOTIFICATION THROUGH THE SERVICES. THE UPDATED
                                TERMS OF SERVICE WILL BECOME EFFECTIVE AS OF THE
                                EFFECTIVE DATE INDICATED IN THE TERMS OF SERVICE
                                (“EFFECTIVE DATE”). ANY USE OF THE SERVICES
                                AFTER THE EFFECTIVE DATE MEANS YOU HAVE ACCEPTED
                                THE UPDATED TERMS. YOUR SOLE AND EXCLUSIVE
                                REMEDY IN THE EVENT YOU DO NOT ACCEPT THE
                                UPDATED TERMS OF SERVICE IS TO CEASE YOUR ACCESS
                                TO AND USE OF THE SERVICES.
                                <br />
                                <br />
                                ANY OF YOUR OBLIGATIONS SET OUT IN THESE TERMS
                                OF SERVICE ARE IN ADDITION TO, AND NOT IN
                                SUBSTITUTION OF, ANY OTHER OBLIGATIONS IMPOSED
                                ON YOU BY THE PROMISE “SERVICE AGREEMENT” AND
                                “REGISTRATION FORM”, ALONG WITH ANY PROMISE
                                AFFILIATED PARTNER OR THIRD-PARTY.
                                <br></br>
                                <br></br>
                                <span>
                                    <span style={{ listStyle: "decimal" }}>
                                        <ol type="1">
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Use of Services.</b>
                                                <ol type="1">
                                                    <li>
                                                        You may only access and
                                                        use the Services if you
                                                        are an authorized
                                                        employee of a Promise
                                                        customer (“Merchant”)
                                                        that has paid for a
                                                        software subscription
                                                        for Promise Services
                                                        pursuant to a Service
                                                        Agreement entered into
                                                        between Promise and
                                                        Merchant. Promise grants
                                                        you a personal, limited,
                                                        revocable,
                                                        non-exclusive,
                                                        non-transferable license
                                                        to access and use the
                                                        applicable Services
                                                        during the course of
                                                        your employment with
                                                        Merchant, solely and
                                                        exclusively for
                                                        Merchant’s internal
                                                        business purposes,
                                                        without the right to
                                                        sublicense or assign in
                                                        any way. If Promise
                                                        provides you with copies
                                                        of or access to any
                                                        software or
                                                        documentation, unless
                                                        otherwise expressly
                                                        stated in writing, that
                                                        software and
                                                        documentation is
                                                        provided on a personal,
                                                        non-exclusive,
                                                        non-transferable,
                                                        non-assignable,
                                                        revocable limited
                                                        license for the period
                                                        of your subscription to
                                                        the Services and solely
                                                        for you to access and
                                                        use the software and
                                                        documentation to receive
                                                        the Services for its
                                                        intended purpose on
                                                        approved devices owned
                                                        or licensed by you.
                                                    </li>
                                                    <li>
                                                        You agree to use the
                                                        Services only for the
                                                        management and operation
                                                        of Merchant’s business
                                                        pursuant to the terms
                                                        and conditions of the
                                                        Service Agreement and
                                                        not directly or
                                                        indirectly: (a) reverse
                                                        engineer, decompile,
                                                        disassemble or otherwise
                                                        attempt to discover the
                                                        source code, object code
                                                        or underlying structure,
                                                        ideas or algorithms of
                                                        the Services; (b)
                                                        modify, translate, or
                                                        create derivative works
                                                        based on the Services;
                                                        or copy (except for
                                                        archival purposes),
                                                        rent, lease, distribute,
                                                        pledge, assign, or
                                                        otherwise transfer or
                                                        encumber rights to the
                                                        Services; (c) use or
                                                        access the Services to
                                                        build or support, and/or
                                                        assist a third party in
                                                        building or supporting,
                                                        products or services
                                                        competitive with the
                                                        Services; (d) remove or
                                                        obscure any proprietary
                                                        notices or labels from
                                                        the Services; (e) use
                                                        the Services for any
                                                        fraudulent undertaking
                                                        or in any manner that
                                                        could damage, disable,
                                                        overburden, impair or
                                                        otherwise interfere with
                                                        Promise's provisioning
                                                        of the Services; (f)
                                                        violate or breach any
                                                        operating procedures,
                                                        requirements or
                                                        guidelines regarding
                                                        Merchant’s use of the
                                                        Services that are posted
                                                        on or through the
                                                        Promise Platform or
                                                        otherwise provided or
                                                        made available to
                                                        Merchant; (g) alter,
                                                        distribute, license,
                                                        resell, transfer,
                                                        assign, rent, lease,
                                                        timeshare or otherwise
                                                        commercially exploit the
                                                        Services to any third-
                                                        party or provide it as a
                                                        service bureau; (h)
                                                        conduct any penetration
                                                        or vulnerability testing
                                                        on the Services or
                                                        network; (i) copy any
                                                        features, functions,
                                                        text or graphics of the
                                                        Services, including
                                                        without limitation, the
                                                        structure, sequence or
                                                        organization of the user
                                                        interface; (j) without
                                                        Promise’s written
                                                        consent, use, ship or
                                                        access the Services (or
                                                        any part) outside the
                                                        jurisdiction in which
                                                        you operate and have
                                                        been approved by
                                                        Promise; or (k) perform
                                                        or attempt to perform
                                                        any actions that would
                                                        interfere with the
                                                        proper working of the
                                                        Services, prevent access
                                                        to or use the Services
                                                        by other users, or
                                                        impose a large load on
                                                        Promise’s
                                                        infrastructure, network
                                                        capability or bandwidth.
                                                    </li>
                                                    <li>
                                                        You may access the
                                                        Services through Promise
                                                        approved hardware or
                                                        your own tablet or other
                                                        computing hardware,
                                                        either fixed or mobile,
                                                        that is of a form factor
                                                        identified by Promise as
                                                        compatible with and
                                                        capable of accessing
                                                        and/or supporting the
                                                        Services ("Device")
                                                        using a wired (Ethernet)
                                                        or wireless (Wi-Fi or
                                                        cellular) connection to
                                                        the Internet. You are
                                                        solely responsible for
                                                        the payment of any fees
                                                        that may be imposed by
                                                        your Internet/data
                                                        provider. Your use of
                                                        the Service accessed
                                                        wirelessly or through
                                                        the Internet is subject
                                                        to: (a) the terms of any
                                                        agreements you have with
                                                        your Internet/data
                                                        provider; and (b)
                                                        availability,
                                                        transmission range and
                                                        uptime of the services
                                                        and any wireless
                                                        equipment.
                                                    </li>
                                                    <li>
                                                        You may use the Service
                                                        to conduct point of sale
                                                        activities offline.
                                                        Point of sale activity
                                                        initiated offline will
                                                        be queued and
                                                        synchronized when
                                                        Internet connectivity to
                                                        the Promise platform is
                                                        restored. Payment
                                                        related transactions may
                                                        not be entered into the
                                                        Promise platform while
                                                        offline, and you must
                                                        make arrangements to
                                                        complete payment
                                                        transactions separately
                                                        or when you are back
                                                        online. You assume all
                                                        risk, responsibility and
                                                        liability associated
                                                        with any transaction
                                                        that you choose to
                                                        conduct while the
                                                        Service is offline.
                                                    </li>
                                                    <li>
                                                        The Services do not
                                                        function with every
                                                        mobile or hardware
                                                        device. Promise may
                                                        alter which Devices are
                                                        approved as compatible
                                                        with the Services in
                                                        Promise's discretion.
                                                    </li>
                                                    <li>
                                                        You shall at all times
                                                        comply with any
                                                        operating procedures,
                                                        requirements, or
                                                        guidelines regarding
                                                        your use of the Services
                                                        that are posted on the
                                                        Promise Website
                                                        (http://www.promise.network)
                                                        or otherwise provided or
                                                        made available to you.
                                                    </li>
                                                    <li>
                                                        You must comply with
                                                        applicable law,
                                                        including obtaining any
                                                        legally required
                                                        consent, when collecting
                                                        and using customer
                                                        contact details to
                                                        communicate with your
                                                        customers through the
                                                        Services. You must
                                                        promptly honor any
                                                        customer opt-out.
                                                    </li>
                                                    <li>
                                                        Promise may, at its
                                                        discretion, release
                                                        enhancements,
                                                        improvements or other
                                                        updates to any software.
                                                        If Promise notifies you
                                                        that such update
                                                        requires an
                                                        installation, you shall
                                                        integrate and install
                                                        such update into your
                                                        systems within 30 days
                                                        of your receipt of such
                                                        notice.{" "}
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>
                                                    Ownership of Content, Use of
                                                    Trademarks
                                                </b>{" "}
                                                <ol type="1">
                                                    <li>
                                                        Promise owns or has
                                                        licenses to all rights,
                                                        title, interest,
                                                        copyright and other
                                                        worldwide intellectual
                                                        property and trade
                                                        secret rights in and to
                                                        the Services (including
                                                        all derivatives or
                                                        improvements thereof).
                                                        You may voluntarily
                                                        submit suggestions,
                                                        enhancement requests,
                                                        ideas, feedback,
                                                        recommendations or other
                                                        input about the Services
                                                        (“Feedback”) at any
                                                        time. You irrevocably
                                                        assign all right, title,
                                                        interest and other
                                                        worldwide intellectual
                                                        property rights in and
                                                        to the Feedback to
                                                        Promise, and acknowledge
                                                        that we are free to use,
                                                        disclose, reproduce and
                                                        otherwise exploit any
                                                        and all Feedback
                                                        provided by you relating
                                                        to the Services in our
                                                        sole discretion,
                                                        entirely without
                                                        obligation or
                                                        restriction of any kind.
                                                        Any rights not expressly
                                                        granted herein are
                                                        reserved by Promise.
                                                    </li>
                                                    <li>
                                                        User Content. You, (or
                                                        Merchant, if applicable)
                                                        retain all rights, title
                                                        and interest in and to
                                                        any text, graphics,
                                                        videos, images or other
                                                        data (including but not
                                                        limited to personal
                                                        information) that you
                                                        upload or that is
                                                        otherwise made available
                                                        within the Services
                                                        (“User Content”). You
                                                        grant to Promise a
                                                        non-exclusive,
                                                        royalty-free, fully
                                                        paid-up, worldwide
                                                        license to access, use,
                                                        copy, modify (including
                                                        the right to create
                                                        derivative works of),
                                                        display and transmit
                                                        User Content solely for
                                                        the purpose of our
                                                        providing the Services
                                                        and in accordance with
                                                        our Privacy Statement.
                                                        You are solely
                                                        responsible for the
                                                        accuracy, quality,
                                                        content and legality of
                                                        User Content, the means
                                                        by which User Content is
                                                        acquired, and any
                                                        transfer of User Content
                                                        outside of the Services
                                                        by you, Merchant or any
                                                        third-party authorized
                                                        by you. You represent,
                                                        warrant and covenant
                                                        that you have all rights
                                                        necessary to upload the
                                                        User Content to the
                                                        Services and to
                                                        otherwise have such User
                                                        Content used or shared,
                                                        as applicable, in
                                                        relation to the
                                                        Services.
                                                    </li>
                                                    <li>
                                                        Third-Party Content.
                                                        Through your use of the
                                                        Services you may be
                                                        presented with material
                                                        provided by
                                                        third-parties, not owned
                                                        or controlled by us,
                                                        from our partners,
                                                        and/or from other users
                                                        of the Services,
                                                        including but not
                                                        limited to software,
                                                        payment related data or
                                                        history, payment
                                                        facilitation tools and
                                                        experiences, text,
                                                        graphics, videos,
                                                        images, or advertising
                                                        content (collectively
                                                        referred to as
                                                        “Third-Party Content”).
                                                        All Third-Party Content
                                                        and the Services are
                                                        protected by United
                                                        States, Canadian, and
                                                        foreign intellectual
                                                        property laws.
                                                        Unauthorized use of the
                                                        Services and/or
                                                        Third-Party Content may
                                                        result in violation of
                                                        copyright, trademark,
                                                        and other laws. Except
                                                        as expressly set forth
                                                        herein, you have no
                                                        rights in or to the
                                                        Services or Third-Party
                                                        Content, and you will
                                                        not use, copy or display
                                                        the Services or
                                                        Third-Party Content
                                                        except as permitted
                                                        under these Terms of
                                                        Service. No other use of
                                                        the Services or
                                                        Third-Party Content is
                                                        permitted without our
                                                        prior written consent.
                                                        You must retain all
                                                        copyright and other
                                                        proprietary notices
                                                        contained in the
                                                        Services and Third-Party
                                                        Content. You may not
                                                        sell, transfer, assign,
                                                        license, sublicense, or
                                                        modify the Third-Party
                                                        Content or reproduce,
                                                        display, publicly
                                                        perform, make a
                                                        derivative version of,
                                                        distribute, or otherwise
                                                        use the Third-Party
                                                        Content in any way for
                                                        any public or commercial
                                                        purpose other than as
                                                        permitted hereunder. The
                                                        use or posting of any of
                                                        the Third-Party Content
                                                        on any other platform,
                                                        or in a networked
                                                        computer environment for
                                                        any purpose is expressly
                                                        prohibited. If you
                                                        violate any part of
                                                        these Terms of Service,
                                                        your right to access
                                                        and/or use the
                                                        Third-Party Content and
                                                        Services will
                                                        automatically terminate.
                                                    </li>
                                                    <li>
                                                        We do not review,
                                                        pre-screen or filter
                                                        User Content, or
                                                        Third-Party Content, but
                                                        we do reserve the right
                                                        to refuse to accept, or
                                                        delete any User Content
                                                        or Third-Party Content
                                                        in our sole discretion.
                                                        In addition, we have the
                                                        right (but not the
                                                        obligation) in our sole
                                                        discretion to reject or
                                                        delete any content that
                                                        we reasonably consider
                                                        to be in violation of
                                                        these Terms of Service
                                                        or applicable law. We do
                                                        not guarantee the
                                                        accuracy, integrity or
                                                        quality of any
                                                        Third-Party Content,
                                                        regardless of whether
                                                        such products or
                                                        services are designated
                                                        as “certified,”
                                                        “validated” or the like.
                                                        Any interaction or
                                                        exchange of information
                                                        or data between you and
                                                        any third-party is
                                                        solely between you and
                                                        such third-party. You
                                                        should take precautions
                                                        when downloading files
                                                        from any platform to
                                                        protect your computer
                                                        from viruses and other
                                                        destructive programs. If
                                                        you decide to access any
                                                        Third-Party Content, you
                                                        fully assume the risk of
                                                        doing so. Under no
                                                        circumstances will
                                                        Promise be liable in any
                                                        way for any Third-Party
                                                        Content, including
                                                        liability for any errors
                                                        or omissions in any
                                                        Third-Party Content or
                                                        for any loss or damage
                                                        of any kind incurred as
                                                        a result of the use of
                                                        any Third-Party Content
                                                        posted, emailed or
                                                        otherwise transmitted
                                                        via the Services.
                                                    </li>
                                                    <li>
                                                        Each user must: (a)
                                                        provide true, accurate,
                                                        current and complete
                                                        information on the
                                                        Promise Platform or
                                                        applicable Promise
                                                        registration form
                                                        (collectively, the
                                                        "Registration Data") and
                                                        (b) maintain and
                                                        promptly update the
                                                        Registration Data as
                                                        necessary. If, after
                                                        investigation, we have
                                                        reasonable grounds to
                                                        suspect that any of your
                                                        information is untrue,
                                                        inaccurate, not current
                                                        or incomplete, we may
                                                        suspend or terminate
                                                        your account and
                                                        prohibit any and all
                                                        current or future use of
                                                        the Services (or any
                                                        portion thereof) by you
                                                        other than as expressly
                                                        provided herein. You are
                                                        wholly responsible for
                                                        maintaining the
                                                        confidentiality and
                                                        security of your
                                                        username and password,
                                                        and you are wholly
                                                        liable for all
                                                        activities occurring
                                                        thereunder. Promise
                                                        cannot and will not be
                                                        liable for any loss or
                                                        damage arising from your
                                                        failure to comply with
                                                        this Sub-Section 2.5,
                                                        including any loss or
                                                        damage arising from your
                                                        failure to (a)
                                                        immediately notify
                                                        Promise of any
                                                        unauthorized use of your
                                                        password or account or
                                                        any other breach of
                                                        security, or (b) exit
                                                        and close your account
                                                        at the end of each
                                                        session.
                                                    </li>
                                                    <li>
                                                        The trademarks, service
                                                        marks, and logos of
                                                        Promise (the “Promise
                                                        Trademarks”) used and
                                                        displayed on the
                                                        Services are registered
                                                        and unregistered
                                                        trademarks or service
                                                        marks of Promise. Other
                                                        Promise product and
                                                        service names located in
                                                        the Services may be
                                                        trademarks or service
                                                        marks owned by
                                                        third-parties (the
                                                        “Third-Party
                                                        Trademarks”, and,
                                                        collectively with the
                                                        Promise Trademarks, the
                                                        “Trademarks”). Nothing
                                                        in these Terms of
                                                        Service should be
                                                        construed as granting,
                                                        by implication,
                                                        estoppel, or otherwise,
                                                        any license or right to
                                                        use any Trademark
                                                        displayed in the
                                                        Services or otherwise
                                                        without the prior
                                                        written consent of
                                                        Promise specific for
                                                        each such use. The
                                                        Trademarks may not be
                                                        used to disparage
                                                        Promise or the
                                                        applicable third-party,
                                                        Promise’s or
                                                        third-party’s products
                                                        or services, or in any
                                                        manner that may damage
                                                        any goodwill in the
                                                        Trademarks. Except as
                                                        described herein, the
                                                        use of any Trademarks is
                                                        prohibited without
                                                        Promise’s prior written
                                                        consent. All goodwill
                                                        generated from the use
                                                        of any Promise Trademark
                                                        or Third-Party Trademark
                                                        will inure to Promise’s,
                                                        or the applicable Third
                                                        Party, as applicable.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Privacy and Security</b>{" "}
                                                <br />
                                                The privacy and security of your
                                                personal information is
                                                important to us. Promise’s
                                                Privacy Statement describes what
                                                information we collect about
                                                you, how we may use personal
                                                information and the security
                                                measures we have taken to
                                                protect your personal
                                                information. We encourage you to
                                                read the Privacy Statement
                                                carefully as it forms a binding
                                                part of these Terms of Service
                                                and contains important
                                                information about your rights.
                                                <ol type="1">
                                                    <li>
                                                        You must implement
                                                        reasonable security
                                                        measures designed to
                                                        protect the personal
                                                        information that you
                                                        collect, use, disclose,
                                                        transfer, or otherwise
                                                        process in connection
                                                        with your use of the
                                                        Services and hardware.
                                                        You acknowledge and
                                                        agree that you are
                                                        solely responsible for
                                                        all privacy and
                                                        information security
                                                        obligations and
                                                        liabilities relating to
                                                        any data that you
                                                        download, export, or
                                                        otherwise transfer from
                                                        the Services or hardware
                                                        to your own information
                                                        environment.
                                                    </li>
                                                    <li>
                                                        You shall maintain and
                                                        make available to
                                                        consumers a privacy
                                                        policy applicable to
                                                        your use of the Services
                                                        and hardware, where
                                                        applicable, including
                                                        any applications
                                                        installed on the
                                                        hardware.
                                                    </li>
                                                    <li>
                                                        You must ensure that any
                                                        third parties with which
                                                        you share personal
                                                        information in
                                                        connection with your use
                                                        of the Services or
                                                        hardware will provide
                                                        the same level of
                                                        privacy and data
                                                        security protection that
                                                        you are legally required
                                                        to maintain and which
                                                        you promise to maintain.
                                                    </li>
                                                    <li>
                                                        You must respond in a
                                                        legally appropriate
                                                        manner to any legally
                                                        valid requests from
                                                        individuals pertaining
                                                        to the individual’s
                                                        privacy or data subject
                                                        rights at your sole cost
                                                        and expense.
                                                    </li>
                                                    <li>
                                                        You acknowledge and
                                                        agree that when you
                                                        install an application
                                                        on the hardware, you
                                                        establish a contractual
                                                        relationship with the
                                                        developer of the
                                                        application. By
                                                        installing an
                                                        application, you
                                                        authorize and instruct
                                                        Promise to process and
                                                        transfer personal
                                                        information to
                                                        facilitate your ongoing
                                                        use of the application,
                                                        including the disclosure
                                                        of certain categories of
                                                        personal information to
                                                        the developer of the
                                                        mobile application and
                                                        the receipt of personal
                                                        information from the
                                                        developer, as may be
                                                        required by the
                                                        application, until such
                                                        time as you instruct
                                                        Promise otherwise. You
                                                        are solely responsible
                                                        for instructing an
                                                        application developer to
                                                        cease processing and/or
                                                        destroy any personal
                                                        information.
                                                    </li>
                                                    <li>
                                                        Promise may process
                                                        personal information to
                                                        create aggregated,
                                                        anonymized, or
                                                        de-identified
                                                        information and use that
                                                        information for its
                                                        lawful business
                                                        purposes, including for
                                                        purposes of creating
                                                        data insights and
                                                        analytics and
                                                        demographic profiling.
                                                    </li>
                                                    <li>
                                                        Unless you have received
                                                        prior written consent to
                                                        do so from Promise, you
                                                        may not use the Services
                                                        to (a) process personal
                                                        information revealing
                                                        racial or ethnic origin,
                                                        political opinions,
                                                        religious or
                                                        philosophical beliefs,
                                                        or trade union
                                                        membership; or genetic
                                                        data, biometric data,
                                                        data concerning health,
                                                        or data concerning a
                                                        natural person’s sex
                                                        life or sexual
                                                        orientation; or (b)
                                                        upload or incorporate,
                                                        process transactions
                                                        involving, or otherwise
                                                        provide Promise with,
                                                        any “protected health
                                                        information” within the
                                                        meaning of the Health
                                                        Insurance Portability
                                                        and Accountability Act
                                                        of 1996, as amended
                                                        (“HIPAA”).
                                                    </li>
                                                    <li>
                                                        You agree to provide
                                                        reasonable assistance to
                                                        help Promise comply with
                                                        its privacy or data
                                                        protection legal
                                                        obligations, or defend
                                                        against any claims or
                                                        investigations, in
                                                        either case, in any way
                                                        arising from or related
                                                        to the Terms. You agree
                                                        to promptly notify
                                                        Promise of any opt-outs
                                                        and legally valid data
                                                        subject rights requests
                                                        relating to data with
                                                        Promise’s possession,
                                                        custody, or control.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>
                                                    Limitation of Liability and
                                                    Disclaimer of Warranties
                                                </b>{" "}
                                                <ol type="1">
                                                    <li>
                                                        EXCEPT FOR THE EXPRESS
                                                        WARRANTIES SET FORTH
                                                        HEREIN, PROMISE AND ITS
                                                        THIRD-PARTY PROVIDERS
                                                        HEREBY DISCLAIM ALL
                                                        EXPRESS OR IMPLIED
                                                        WARRANTIES WITH REGARD
                                                        TO THE SERVICES,
                                                        INCLUDING BUT NOT
                                                        LIMITED TO ANY IMPLIED
                                                        WARRANTIES OF
                                                        MERCHANTABILITY, FITNESS
                                                        FOR A PARTICULAR
                                                        PURPOSE, TITLE, NON-
                                                        INFRINGEMENT AND
                                                        QUALITY. PROMISE AND ITS
                                                        THIRD-PARTY PROVIDERS
                                                        MAKE NO REPRESENTATIONS
                                                        OR WARRANTIES REGARDING
                                                        THE RELIABILITY,
                                                        AVAILABILITY,
                                                        TIMELINESS, SUITABILITY,
                                                        ACCURACY OR COMPLETENESS
                                                        OF THE SERVICES OR THE
                                                        RESULTS YOU MAY OBTAIN
                                                        BY USING THE SERVICES.
                                                        WITHOUT LIMITING THE
                                                        GENERALITY OF THE
                                                        FOREGOING, PROMISE AND
                                                        ITS THIRD-PARTY
                                                        PROVIDERS DO NOT
                                                        REPRESENT OR WARRANT
                                                        THAT (A) THE OPERATION
                                                        OR USE OF THE SERVICES
                                                        WILL BE TIMELY,
                                                        UNINTERRUPTED OR
                                                        ERROR-FREE; OR (B) THE
                                                        QUALITY OF THE SERVICES
                                                        WILL MEET YOUR
                                                        REQUIREMENTS. YOU
                                                        ACKNOWLEDGE THAT NEITHER
                                                        PROMISE NOR ITS THIRD-
                                                        PARTY PROVIDERS CONTROL
                                                        THE TRANSFER OF DATA
                                                        OVER COMMUNICATIONS
                                                        FACILITIES, INCLUDING
                                                        THE INTERNET, AND THAT
                                                        THE SERVICES MAY BE
                                                        SUBJECT TO LIMITATIONS,
                                                        DELAYS, AND OTHER
                                                        PROBLEMS INHERENT IN THE
                                                        USE OF SUCH
                                                        COMMUNICATIONS
                                                        FACILITIES. PROMISE IS
                                                        NOT RESPONSIBLE FOR ANY
                                                        DELAYS, DELIVERY
                                                        FAILURES, OR OTHER
                                                        DAMAGE RESULTING FROM
                                                        SUCH PROBLEMS. WITHOUT
                                                        LIMITING THE FOREGOING,
                                                        PROMISE DOES NOT WARRANT
                                                        OR GUARANTEE THAT ANY OR
                                                        ALL SECURITY ATTACKS
                                                        WILL BE DISCOVERED,
                                                        REPORTED OR REMEDIED, OR
                                                        THAT THERE WILL NOT BE
                                                        ANY SECURITY BREACHES BY
                                                        THIRD PARTIES. EXCEPT
                                                        WHERE EXPRESSLY PROVIDED
                                                        OTHERWISE BY PROMISE,
                                                        THE SERVICES ARE
                                                        PROVIDED TO MERCHANT ON
                                                        AN "AS IS" BASIS.{" "}
                                                    </li>
                                                    <li>
                                                        IN NO EVENT WILL PROMISE
                                                        BE LIABLE UNDER ANY
                                                        CONTRACT, NEGLIGENCE,
                                                        STRICT LIABILITY OR
                                                        OTHER THEORY: (A) FOR
                                                        ANY INDIRECT, EXEMPLARY,
                                                        INCIDENTAL, SPECIAL OR
                                                        CONSEQUENTIAL DAMAGES;
                                                        (B) FOR LOSS OF USE,
                                                        INACCURACY, COST OF
                                                        PROCUREMENT OF
                                                        SUBSTITUTE GOODS,
                                                        SERVICES OR TECHNOLOGY,
                                                        LOSS OF PROFITS, DATA OR
                                                        BUSINESS INTERRUPTION;
                                                        OR (C) FOR ANY MATTER
                                                        BEYOND ITS REASONABLE
                                                        CONTROL, WHETHER OR NOT
                                                        FORESEEABLE, EVEN IF
                                                        PROMISE HAS BEEN ADVISED
                                                        OF THE POSSIBILITY OF
                                                        SUCH LOSS OR DAMAGE, AND
                                                        EVEN IF A REMEDY SET
                                                        FORTH HEREIN HAS FAILED
                                                        ITS ESSENTIAL PURPOSE.
                                                    </li>
                                                    <li>
                                                        TO THE MAXIMUM EXTENT
                                                        PERMITTED BY APPLICABLE
                                                        LAW AND RULES, PROMISE’S
                                                        AGGREGATE LIABILITY TO
                                                        YOU OR ANY THIRD PARTIES
                                                        IN ANY CIRCUMSTANCE IS
                                                        LIMITED TO ONE HUNDRED
                                                        DOLLARS ($100).
                                                    </li>
                                                    <li>
                                                        Failure to install any
                                                        updates in a timely
                                                        fashion may impair the
                                                        functionality of the
                                                        software or Services.
                                                        Promise shall have no
                                                        liability for your
                                                        failure to properly
                                                        install the most current
                                                        version of any software
                                                        or any update, and
                                                        Promise shall have no
                                                        obligation to provide
                                                        support or services for
                                                        any outdated versions.
                                                        Certain software can
                                                        automatically install,
                                                        download, and/or deploy
                                                        updated and/or new
                                                        components, which may
                                                        include a new version of
                                                        the software itself. You
                                                        shall not, in any event
                                                        or in any manner, impede
                                                        the update process. You
                                                        agree to assume full
                                                        responsibility and
                                                        indemnify Promise for
                                                        all damages and losses,
                                                        of any nature, for all
                                                        adverse results or
                                                        third-party claims
                                                        arising from your
                                                        impeding the update
                                                        process.
                                                    </li>
                                                    <li>
                                                        You represent and
                                                        warrant that:{" "}
                                                        <ol type="a">
                                                            <li>
                                                                you are validly
                                                                existing, in
                                                                good standing
                                                                and have the
                                                                right, power,
                                                                and authority to
                                                                enter into and
                                                                perform under
                                                                these Terms of
                                                                Service;
                                                            </li>
                                                            <li>
                                                                any sales
                                                                transaction
                                                                submitted by you
                                                                (i) is genuine
                                                                and arises from
                                                                a genuine sale
                                                                or service that
                                                                you directly
                                                                sold or
                                                                provided, (ii)
                                                                accurately
                                                                describes the
                                                                goods or
                                                                services sold
                                                                and delivered to
                                                                a purchaser and
                                                                (iii) represents
                                                                the correct
                                                                amount of goods
                                                                or services
                                                                purchased from
                                                                your business;
                                                            </li>
                                                            <li>
                                                                you will fulfill
                                                                all of your
                                                                obligations to
                                                                each customer
                                                                for which you
                                                                submit a
                                                                transaction and
                                                                will resolve any
                                                                consumer dispute
                                                                or complaint
                                                                directly with
                                                                the consumer;
                                                            </li>
                                                            <li>
                                                                all transactions
                                                                initiated by you
                                                                and your use of
                                                                the Services
                                                                will comply with
                                                                all federal,
                                                                state, and local
                                                                laws, rules, and
                                                                regulations
                                                                applicable to
                                                                your business,
                                                                including any
                                                                applicable tax
                                                                laws and
                                                                regulations and
                                                                card association
                                                                rules and
                                                                regulations,
                                                                including those
                                                                related to
                                                                surcharging or
                                                                cash discounting
                                                                in which you
                                                                elect to
                                                                participate;
                                                            </li>
                                                            <li>
                                                                except in the
                                                                ordinary course
                                                                of business, no
                                                                sales
                                                                transaction
                                                                submitted by you
                                                                through the
                                                                Services will
                                                                represent a sale
                                                                to any
                                                                principal,
                                                                partner,
                                                                proprietor, or
                                                                owner of your
                                                                entity;
                                                            </li>
                                                            <li>
                                                                you will not use
                                                                the Service,
                                                                directly or
                                                                indirectly, for
                                                                any fraudulent
                                                                undertaking or
                                                                in any manner so
                                                                as to interfere
                                                                with the use of
                                                                the Services;
                                                                and
                                                            </li>
                                                            <li>
                                                                you are not
                                                                engaged in and
                                                                will not accept
                                                                payment for any
                                                                illegal
                                                                activity, in the
                                                                legal
                                                                jurisdiction(s)
                                                                in which you do
                                                                business or
                                                                provide goods
                                                                and/or services.
                                                            </li>
                                                        </ol>
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Indemnification</b>
                                                <ol type="1">
                                                    <li>
                                                        You agree to defend,
                                                        indemnify and hold
                                                        harmless Promise and its
                                                        directors, officers,
                                                        employees, affiliates
                                                        and agents from and
                                                        against any claims,
                                                        liability, damages,
                                                        judgments, tax
                                                        assessments, penalties,
                                                        interest, and expenses
                                                        and costs, actions or
                                                        demands, including,
                                                        without limitation,
                                                        reasonable legal and
                                                        accounting fees, arising
                                                        or resulting from and
                                                        claim, action, audit,
                                                        investigation, inquiry,
                                                        or other proceeding
                                                        instituted by a person
                                                        or entity that arises
                                                        out of or relates to:
                                                        <br />
                                                        <br />
                                                        <ol type="a">
                                                            <li>
                                                                your breach or
                                                                alleged breach
                                                                of these Terms
                                                                of Service, our
                                                                Privacy
                                                                Statement or any
                                                                other policy
                                                                issued by
                                                                Promise,
                                                                including
                                                                without
                                                                limitation any
                                                                violation of our
                                                                policies or the
                                                                card
                                                                associations’
                                                                rules;
                                                            </li>
                                                            <li>
                                                                your access to,
                                                                use or misuse of
                                                                the Third-Party
                                                                Content or
                                                                Services;
                                                            </li>
                                                            <li>
                                                                the intellectual
                                                                property rights
                                                                of any person,
                                                                third party,
                                                                Promise
                                                                Affiliated
                                                                Partner, or
                                                                entity;{" "}
                                                            </li>
                                                            <li>
                                                                any Applicable
                                                                Law or Rules
                                                                including,
                                                                without
                                                                limitation,
                                                                privacy and
                                                                consumer
                                                                protection laws;
                                                            </li>
                                                            <li>
                                                                any transaction
                                                                submitted by you
                                                                through the
                                                                Services
                                                                (including
                                                                without
                                                                limitation the
                                                                accuracy of any
                                                                product
                                                                information that
                                                                you provide or
                                                                any claim or
                                                                dispute arising
                                                                out of products
                                                                or services
                                                                offered or sold
                                                                by you);
                                                            </li>
                                                            <li>
                                                                your use of any
                                                                personal
                                                                information
                                                                obtained in
                                                                connection with
                                                                your use of the
                                                                Services or the
                                                                hardware, or any
                                                                application used
                                                                on the hardware;
                                                                <br />
                                                                <br />
                                                                the activities
                                                                under your
                                                                account with
                                                                Promise, or any
                                                                other party’s
                                                                access and/or
                                                                use of the
                                                                Services or
                                                                hardware with
                                                                your unique
                                                                username,
                                                                password, API
                                                                key, or other
                                                                appropriate
                                                                security code;
                                                            </li>
                                                            <li>
                                                                your failure to
                                                                maintain
                                                                reasonable
                                                                security in
                                                                connection with
                                                                the use of the
                                                                Services or the
                                                                hardware;
                                                            </li>
                                                            <li>
                                                                any data breach,
                                                                information
                                                                security
                                                                incident, or
                                                                similar, arising
                                                                from your action
                                                                or inaction;
                                                            </li>
                                                            <li>
                                                                your violation
                                                                of any law, rule
                                                                or regulation of
                                                                the United
                                                                States or any
                                                                other country;
                                                                or
                                                            </li>
                                                            <li>
                                                                any other
                                                                party’s access
                                                                and/or use of
                                                                the Service with
                                                                your usernames,
                                                                password and any
                                                                other sign on
                                                                credentials/access
                                                                controls for the
                                                                Services or any
                                                                software
                                                                provided or
                                                                approved by
                                                                Promise to
                                                                authenticate
                                                                access to, and
                                                                use of, the
                                                                Service and any
                                                                software.
                                                            </li>
                                                        </ol>
                                                    </li>
                                                    <li>
                                                        <li>
                                                            Promise will provide
                                                            notice to you of any
                                                            such claim, suit, or
                                                            proceeding. Promise
                                                            reserves the right
                                                            to assume the
                                                            exclusive defense
                                                            and control of any
                                                            matter which is
                                                            subject to
                                                            indemnification
                                                            under this Section.
                                                            In such case, you
                                                            agree to cooperate
                                                            with any reasonable
                                                            requests assisting
                                                            Promise’s defense of
                                                            such matter.
                                                        </li>
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>
                                                    Term and Termination of the
                                                    Agreement
                                                </b>{" "}
                                                <ol type="1">
                                                    <li>
                                                        Promise reserves the
                                                        right, in its sole
                                                        discretion, to restrict,
                                                        suspend, or terminate
                                                        these Terms of Service
                                                        and your access to all
                                                        or any part of the
                                                        Services or User Content
                                                        at any time and for any
                                                        reason without prior
                                                        notice or liability.
                                                        Promise reserves the
                                                        right to change,
                                                        suspend, or discontinue
                                                        all or any part of the
                                                        Services at any time
                                                        without prior notice or
                                                        liability.
                                                    </li>
                                                    <li>
                                                        Sections 1 (Use of the
                                                        Platform), 4 (Limitation
                                                        of Liability and
                                                        Disclaimer of
                                                        Warranties), 5
                                                        (Indemnification), 6
                                                        (Termination of
                                                        Agreement), 7
                                                        (Arbitration) and 9
                                                        (Miscellaneous) will
                                                        survive the termination
                                                        of these Terms of
                                                        Service.
                                                    </li>
                                                    <li>
                                                        The term of this EULA
                                                        shall take the term as
                                                        set out in your Services
                                                        Agreement with Promise.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Arbitration</b>
                                                <br />
                                                Please read the following
                                                arbitration agreement (the
                                                “Arbitration Agreement”)
                                                carefully. It may require you to
                                                arbitrate most disputes with
                                                Promise and, if applicable to
                                                you, may limit the manner in
                                                which you can seek relief from
                                                us.
                                                <ol type="1">
                                                    <li>
                                                        Agreement to Arbitrate.
                                                        Except where prohibited
                                                        by Applicable Law and
                                                        Rules, you agree that
                                                        any and all disputes or
                                                        claims that have arisen
                                                        or may arise between you
                                                        and Promise, whether
                                                        arising out of or
                                                        relating to these Terms
                                                        of Service or in
                                                        connection with your use
                                                        of the Services, shall
                                                        be resolved exclusively
                                                        through final and
                                                        binding arbitration,
                                                        rather than a court, in
                                                        accordance with the
                                                        terms of this
                                                        Arbitration Agreement,
                                                        except that you may
                                                        assert individual claims
                                                        in small claims court,
                                                        if your claims qualify.
                                                        You agree that, by
                                                        agreeing to these Terms
                                                        of Service, you and
                                                        Promise are each waiving
                                                        the right to a trial by
                                                        jury or to participate
                                                        in a class action. Your
                                                        rights will be
                                                        determined by a neutral
                                                        arbitrator, not a judge
                                                        or jury. The Federal
                                                        Arbitration Act governs
                                                        the interpretation and
                                                        enforcement of this
                                                        Arbitration Agreement.{" "}
                                                        <br />
                                                        <br />
                                                        Notwithstanding the
                                                        foregoing, this
                                                        Arbitration Agreement
                                                        shall not preclude
                                                        either party from
                                                        pursuing a court action
                                                        for the sole purpose of
                                                        obtaining a temporary
                                                        restraining order or
                                                        preliminary injunction
                                                        in circumstances in
                                                        which such relief is
                                                        appropriate, provided
                                                        that any other relief
                                                        shall be pursued through
                                                        an arbitration
                                                        proceeding pursuant to
                                                        this Arbitration
                                                        Agreement.
                                                    </li>
                                                    <li>
                                                        Prohibition of Class and
                                                        Representative Actions
                                                        and Non-Individualized
                                                        Relief. Except where
                                                        prohibited by Applicable
                                                        Law and Rules, you and
                                                        Promise agree that each
                                                        may bring claims against
                                                        the other only on an
                                                        individual basis and not
                                                        as plaintiff or class
                                                        member in any purported
                                                        class or representative
                                                        action or proceeding.
                                                        Unless both you and
                                                        Promise agree otherwise,
                                                        the arbitrator may not
                                                        consolidate or join more
                                                        than one person’s or
                                                        party’s claims and may
                                                        not otherwise preside
                                                        over any form of a
                                                        consolidated,
                                                        representative, or class
                                                        proceeding. Also, the
                                                        arbitrator may award
                                                        relief (including
                                                        monetary, injunctive,
                                                        and declaratory relief)
                                                        only in favor of the
                                                        individual party seeking
                                                        relief and only to the
                                                        extent necessary to
                                                        provide relief
                                                        necessitated by that
                                                        party’s individual
                                                        claim(s).
                                                    </li>
                                                    <li>
                                                        Promise is always
                                                        interested in resolving
                                                        disputes amicably and
                                                        efficiently, and most
                                                        participant concerns can
                                                        be resolved quickly and
                                                        to the participant’s
                                                        satisfaction by
                                                        contacting Promise’s
                                                        Customer Care team at
                                                        SUPPORT@PRIMISE.NETWORK.
                                                        If such efforts prove
                                                        unsuccessful, a party
                                                        who intends to seek
                                                        arbitration must first
                                                        send to the other, by
                                                        certified mail, a
                                                        written Notice of
                                                        Dispute (“Notice”). The
                                                        Notice to Promise should
                                                        be sent to Promise
                                                        Group, Inc. at 332
                                                        Meadow Road, Durham, ME
                                                        04222, Attn: General
                                                        Counsel. The Notice must
                                                        (i) describe the nature
                                                        and basis of the claim
                                                        or dispute and (ii) set
                                                        forth the specific
                                                        relief sought. If you
                                                        and Promise do not
                                                        resolve the claim within
                                                        sixty (60) calendar days
                                                        after the Notice is
                                                        received, you or Promise
                                                        may commence an
                                                        arbitration proceeding.
                                                        During the arbitration,
                                                        the amount of any
                                                        settlement offer made by
                                                        Promise or you shall not
                                                        be disclosed to the
                                                        arbitrator until after
                                                        the arbitrator
                                                        determines the amount,
                                                        if any, to which you or
                                                        Promise is entitled.
                                                    </li>
                                                    <li>
                                                        Arbitration Procedures.
                                                        Arbitration will be
                                                        conducted by a neutral
                                                        arbitrator in accordance
                                                        with the American
                                                        Arbitration
                                                        Association’s (“AAA”)
                                                        rules and procedures,
                                                        including the AAA’s
                                                        Commercial Arbitration
                                                        Rules (collectively, the
                                                        “AAA Rules”), as
                                                        modified by this
                                                        Arbitration Agreement.
                                                        If there is any
                                                        inconsistency between
                                                        any term of the AAA
                                                        Rules and any term of
                                                        this Arbitration
                                                        Agreement, the
                                                        applicable terms of this
                                                        Arbitration Agreement
                                                        will control unless the
                                                        arbitrator determines
                                                        that the application of
                                                        the inconsistent
                                                        Arbitration Agreement
                                                        terms would not result
                                                        in a fundamentally fair
                                                        arbitration. All issues
                                                        are for the arbitrator
                                                        to decide, including,
                                                        but not limited to,
                                                        issues relating to the
                                                        scope, enforceability,
                                                        and arbitrability of
                                                        this Arbitration
                                                        Agreement. The
                                                        arbitrator can award the
                                                        same damages and relief
                                                        on an individual basis
                                                        that a court can award
                                                        to an individual under
                                                        these Terms of Service
                                                        and applicable law.
                                                        Decisions by the
                                                        arbitrator are
                                                        enforceable in court and
                                                        may be overturned by a
                                                        court only for very
                                                        limited reasons. Unless
                                                        you and Promise agree
                                                        otherwise, any
                                                        arbitration hearings
                                                        will take place in a
                                                        reasonably convenient
                                                        location for both
                                                        parties with due
                                                        consideration of their
                                                        ability to travel and
                                                        other pertinent
                                                        circumstances. If the
                                                        parties are unable to
                                                        agree on a location, the
                                                        determination shall be
                                                        made by AAA. If your
                                                        claim is for $10,000 or
                                                        less, Promise agrees
                                                        that you may choose
                                                        whether the arbitration
                                                        will be conducted solely
                                                        on the basis of
                                                        documents submitted to
                                                        the arbitrator, through
                                                        a telephonic hearing or
                                                        by an in-person hearing
                                                        as established by the
                                                        AAA Rules. If your claim
                                                        exceeds $10,000, the
                                                        right to a hearing will
                                                        be determined by the AAA
                                                        Rules. Regardless of the
                                                        manner in which the
                                                        arbitration is
                                                        conducted, the
                                                        arbitrator shall issue a
                                                        reasoned written
                                                        decision sufficient to
                                                        explain the essential
                                                        findings and conclusions
                                                        on which the award is
                                                        based.
                                                    </li>
                                                    <li>
                                                        Costs of Arbitration.
                                                        Payment of all filing,
                                                        administration, and
                                                        arbitrator fees
                                                        (collectively, the
                                                        “Arbitration Fees”) will
                                                        be governed by the AAA
                                                        Rules, unless otherwise
                                                        provided in this
                                                        Arbitration Agreement.
                                                        Any payment of
                                                        attorneys’ fees will be
                                                        governed by the AAA
                                                        Rules.
                                                    </li>
                                                    <li>
                                                        Confidentiality. All
                                                        aspects of the
                                                        arbitration proceeding,
                                                        and any ruling,
                                                        decision, or award by
                                                        the arbitrator, will be
                                                        strictly confidential
                                                        for the benefit of all
                                                        parties.
                                                    </li>
                                                    <li>
                                                        Severability. If a court
                                                        or the arbitrator
                                                        decides that any term or
                                                        provision of this
                                                        Arbitration Agreement
                                                        other than Sub-Section
                                                        7.2 above is invalid or
                                                        unenforceable, the
                                                        parties agree to replace
                                                        such term or provision
                                                        with a term or provision
                                                        that is valid and
                                                        enforceable and that
                                                        comes closest to
                                                        expressing the intention
                                                        of the invalid or
                                                        unenforceable term or
                                                        provision, and this
                                                        Arbitration Agreement
                                                        shall be enforceable as
                                                        so modified. If a court
                                                        or the arbitrator
                                                        decides that any of the
                                                        provisions of
                                                        Sub-Section 7.2 is
                                                        invalid or
                                                        unenforceable, then the
                                                        entirety of this
                                                        Arbitration Agreement
                                                        shall be null and void.
                                                        The remainder of these
                                                        Terms of Service will
                                                        continue to apply.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Compliance with Laws</b>{" "}
                                                <ol type="1">
                                                    <li>
                                                        You agree to comply with
                                                        all federal, state,
                                                        provincial, local and
                                                        foreign laws, rules and
                                                        regulations applicable
                                                        to you and Merchant’s
                                                        business in relation to
                                                        your use of the
                                                        Services, including any
                                                        applicable privacy and
                                                        consumer protection
                                                        laws, tax laws and
                                                        regulations, the
                                                        then-current version of
                                                        the Payment Card
                                                        Industry Data Security
                                                        Standards as made
                                                        available at
                                                        https://www.pcisecuritystandar...
                                                        and the by-laws, and any
                                                        and all other rules,
                                                        policies and procedures
                                                        of VISA, MasterCard,
                                                        Discover and/or other
                                                        card networks as in
                                                        effect from time to
                                                        time. Applicable laws
                                                        may include, but are not
                                                        limited to US federal
                                                        and state laws, such as
                                                        the FTC Act, the
                                                        California Consumer
                                                        Privacy Act, the
                                                        CAN-SPAM Act, the
                                                        Telephone Consumer
                                                        Protection Act, the
                                                        Telemarketing and
                                                        Consumer Fraud and Abuse
                                                        Prevention Act,
                                                        Gramm-Leach-Bliley Act,
                                                        state consumer
                                                        protection laws, state
                                                        data security laws,
                                                        security breach
                                                        notification laws, laws
                                                        imposing minimum
                                                        security requirements,
                                                        laws requiring the
                                                        secure disposal of
                                                        records containing
                                                        certain personal
                                                        information, as well as
                                                        any Promise requirements
                                                        related to such matters.
                                                    </li>
                                                    <li>
                                                        Canada and the United
                                                        States control the
                                                        export of products and
                                                        information. You
                                                        expressly agree to
                                                        comply with such
                                                        restrictions and not to
                                                        export or re-export any
                                                        part of the Services to
                                                        countries or persons
                                                        prohibited under the
                                                        export control laws. By
                                                        accessing, using or
                                                        downloading the
                                                        Services, you are
                                                        expressly agreeing that
                                                        you are not in a country
                                                        where such export is
                                                        prohibited or are a
                                                        person or entity for
                                                        which such export is
                                                        prohibited. You are
                                                        solely responsible for
                                                        compliance with the laws
                                                        of your specific
                                                        jurisdiction regarding
                                                        the import, export or
                                                        re-export of the
                                                        Services.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Miscellaneous </b>
                                                <ol type="1">
                                                    <li>
                                                        Any action, claim, or
                                                        dispute related to these
                                                        Terms of Service will be
                                                        governed by the laws of
                                                        the State of Maine,
                                                        excluding its conflicts
                                                        of law provisions, and
                                                        controlling U.S. federal
                                                        law. Except as set forth
                                                        in Section 7, the
                                                        parties agree that the
                                                        federal or state courts
                                                        in the city of Portland
                                                        shall have exclusive
                                                        jurisdiction to hear and
                                                        determine any dispute
                                                        between them. The
                                                        Uniform Computer
                                                        Information Transactions
                                                        Act will not apply to
                                                        these Terms of Service.
                                                        If any provision of
                                                        these Terms of Service
                                                        is found to be invalid
                                                        by any court having
                                                        competent jurisdiction,
                                                        the invalidity of such
                                                        provision will not
                                                        affect the validity of
                                                        the remaining provisions
                                                        of these Terms of
                                                        Service, which will
                                                        remain in full force and
                                                        effect. Failure of
                                                        Promise to act on or
                                                        enforce any provision of
                                                        these Terms of Service
                                                        will not be construed as
                                                        a waiver of that
                                                        provision or any other
                                                        provision herein. No
                                                        waiver will be effective
                                                        against Promise unless
                                                        made in writing, and no
                                                        such waiver will be
                                                        construed as a waiver in
                                                        any other or subsequent
                                                        instance. Except as
                                                        expressly agreed by
                                                        Promise and you, these
                                                        Terms of Service
                                                        constitute the entire
                                                        agreement between you
                                                        and Promise with respect
                                                        to the subject matter
                                                        hereof, and supersedes
                                                        all previous or
                                                        contemporaneous
                                                        agreements, whether
                                                        written or oral, between
                                                        you and Promise with
                                                        respect to the subject
                                                        matter. The section
                                                        headings are provided
                                                        merely for convenience
                                                        and will not be given
                                                        any legal import. These
                                                        Terms of Service will
                                                        inure to the benefit of
                                                        our successors and
                                                        assigns. You may not
                                                        assign these Terms of
                                                        Service without our
                                                        prior written consent.
                                                        Any information
                                                        submitted or provided by
                                                        you to the Services
                                                        might be publicly
                                                        accessible. Important
                                                        and private information
                                                        should be protected by
                                                        you.
                                                    </li>
                                                    <li>
                                                        You agree that Promise,
                                                        its affiliates and its
                                                        third party
                                                        subcontractors and/or
                                                        agents, may use, in
                                                        addition to any live
                                                        agent calls, an
                                                        automatic telephone
                                                        dialing system, an
                                                        artificial or
                                                        pre-recorded voice, or
                                                        both, to contact you at
                                                        the telephone number(s)
                                                        you have provided,
                                                        and/or may leave a
                                                        detailed voice message
                                                        if you are unable to be
                                                        reached, even if the
                                                        number provided is a
                                                        cellular or wireless
                                                        number or if you have
                                                        previously registered on
                                                        a Do Not Call list or
                                                        requested not to be
                                                        contacted for
                                                        solicitation purposes.
                                                    </li>
                                                    <li>
                                                        You consent to receiving
                                                        commercial electronic
                                                        messages, including
                                                        e-mail messages, SMS and
                                                        text messages, and
                                                        telephone calls, from
                                                        Promise, its affiliates
                                                        and its third party
                                                        sales contractors and/or
                                                        agents.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>
                                                    Promise Affiliated Partners
                                                    and Third-Party Enabled
                                                    Software Applications
                                                </b>{" "}
                                                As part of the Services, Promise
                                                may offer applications or
                                                software infrastructure that are
                                                intended to be operated in
                                                connection with products made
                                                commercially available by third
                                                parties. With respect to such
                                                third-parties or Promise
                                                Affiliated Partners, in addition
                                                to the other terms and
                                                conditions set forth in these
                                                Terms of Service, the following
                                                terms and conditions apply:
                                                <br />
                                                <br />
                                                <ol type="1">
                                                    <li>
                                                        Promise and you
                                                        acknowledge that these
                                                        Terms of Service are
                                                        entered into between
                                                        Promise and you only,
                                                        and not with any third
                                                        party.
                                                    </li>
                                                    <li>
                                                        You may not use
                                                        third-party software in
                                                        any manner that is in
                                                        violation of or
                                                        inconsistent with the
                                                        usage rules set forth by
                                                        such software provider.
                                                    </li>
                                                    <li>
                                                        You represent and
                                                        warrant that (a) you are
                                                        not located in a country
                                                        that is subject to a
                                                        U.S. Government embargo,
                                                        or that has been
                                                        designated by the U.S.
                                                        Government as a
                                                        “terrorist supporting”
                                                        country; and (b) you are
                                                        not listed on any U.S.
                                                        Government list of
                                                        prohibited or restricted
                                                        parties.
                                                    </li>
                                                    <li>
                                                        If you have any
                                                        questions, complaints or
                                                        claims with respect to
                                                        Promise Affiliated
                                                        Partners or third-party
                                                        providers, they should
                                                        be directed to Promise.
                                                    </li>
                                                </ol>
                                            </li>
                                            <br></br>
                                            <li style={{ paddingLeft: 20 }}>
                                                <b>Fees</b>
                                                <br /> You will be charged and
                                                agree to pay the applicable fee
                                                to use the Services, as set out
                                                in your Services Agreement and
                                                accompanying Registration Form,
                                                and all applicable taxes (other
                                                than taxes based on Promise's
                                                income), duties or other
                                                governmental assessments based
                                                on your use of the Services. If
                                                you dispute any amounts you are
                                                charged, you must notify Promise
                                                in writing within 30 days of
                                                incurring the charge that you
                                                dispute. If you notify Promise
                                                after 30 days, you agree Promise
                                                has no obligation to affect any
                                                adjustments or refunds. Any
                                                services to which you agree that
                                                is outside of the Services
                                                provided to you by Promise are
                                                your sole responsibility, and
                                                Promise shall not be responsible
                                                for billing, curing,
                                                administering, or remedying any
                                                claims by you for such outside
                                                services.
                                            </li>
                                        </ol>
                                    </span>
                                </span>
                            </p>
                        </div>

                        <br />
                        <br />
                        <div className="text-center">
                            <Checkbox
                                onChange={() => {
                                    setCheckEULA(!checkEULA);
                                }}
                            >
                                I acknowledge that I have read, understand, and
                                agree to the statements above.
                            </Checkbox>
                        </div>
                        <br></br>
                        <div className="text-right">
                            <Button
                                onClick={e => handleFinish()}
                                disabled={!checkEULA}
                                type="primary"
                                loading={isLoadingEula}
                                color="link"
                            >
                                Finish
                            </Button>
                        </div>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default PageInitLogin;
