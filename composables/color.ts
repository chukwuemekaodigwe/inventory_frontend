<html>
<head>
    <script type="text/javascript" src="https://sdk.monnify.com/plugin/monnify.js"></script>
    <script>
        function payWithMonnify() {
            MonnifySDK.initialize({
                amount: 100,
                currency: "NGN",
                reference: new String((new Date()).getTime()),
                customerFullName: "Damilare Ogunnaike",
                customerEmail: "ogunnaike.damilare@gmail.com",
                apiKey: "MK_PROD_FLX4P92EDF",
                contractCode: "626609763141",
                paymentDescription: "Lahray World",
                metadata: {
                    "name": "Damilare",
                    "age": 45
                },
                incomeSplitConfig: [{
                    "subAccountCode": "MFY_SUB_342113621921",
                    "feePercentage": 50,
                    "splitAmount": 1900,
                    "feeBearer": true
                }, {
                    "subAccountCode": "MFY_SUB_342113621922",
                    "feePercentage": 50,
                    "splitAmount": 2100,
                    "feeBearer": true
                }],

                onLoadStart: () => {
                    console.log("loading has started");
                },
                onLoadComplete: () => {
                    console.log("SDK is UP");
                },

                onComplete: function(response) {
                    //Implement what happens when the transaction is completed.
                    console.log(response);
                },
                onClose: function(data) {
                    //Implement what should happen when the modal is closed here
                    console.log(data);
                }
            });
        }
    </script>
</head>

<body>
    <div>
        <button type="button" onclick="payWithMonnify()">Pay With Monnify</button>
    </div>
</body>
</html>


Response Object

When the transaction is completed, Monnify will return a response object to your onComplete function.


{
    "amount": 100,
    "amountPaid": 100,
    "completed": true,
    "completedOn": "2022-03-31T10:53:50.000+0000",
    "createdOn": "2022-03-31T10:52:09.000+0000",
    "currencyCode": "NGN",
    "customerEmail": "ogunnaike.damilare@gmail.com",
    "customerName": "Damilare Ogunnaike",
    "fee": 10.75,
    "metaData": {
        "deviceType": "mobile",
        "ipAddress": "127.0.0.1"
    },
    "payableAmount": 100,
    "paymentMethod": "CARD",
    "paymentReference": "MNFY|PAYREF|GENERATED|1648723909057299503",
    "paymentStatus": "PAID",
    "transactionReference": "MNFY|67|20220331115209|000063"
}


If a user cancels, Monnify returns the following response to your onClose function
{
    "authorizedAmount": 30,
    "paymentStatus": "USER_CANCELLED",
    "redirectUrl": null,
    "responseCode": "USER_CANCELLED",
    "responseMessage": "User cancelled Transaction"
}


