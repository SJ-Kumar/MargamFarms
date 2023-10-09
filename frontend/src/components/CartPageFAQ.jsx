import React from "react";
import Faq from "react-faq-component";

const data = {
    //title: "FREQUENTLY ASKED QUESTIONS",
    rowContentTextSize: "10px",
    rows: [
        {
            title: "HOW LONG WILL MY ORDER TAKE TO ARRIVE?",
            content: `We give you the option to use Dunzo for local or MSS/ABT parcel service at checkout. <br/>
 
            Dunzo: Priority (2-3 hrs depending on the location in Bangalore/Chennai).<br/>
            
            MSS/ABT: Ground (2-4 business days depending on location)<br/>
            
            Please note this does not apply to weekend orders as well as peak sale periods and peak holiday seasons. Orders may be delayed by up to 48 hours during these periods. 
            
            Delivery timeframes can vary over the public holiday periods due to overwhelming demand on postal services. Please expect delays on estimated delivery times and customer service response from delivery providers. Thank you for your consideration.`,
        },
 
 
        {
            title: "HOW MUCH IS SHIPPING CHARGES?",
            content:
                "Shipping is calculated at checkout based on your delivery address and preferred method of delivery. We offer free shipping on all orders over ₹1000.",
        },
 
        {
            title: "CAN I HAVE MY ORDER EXPRESS POSTED?",
            content: ` Yes, we offer a Priority Express option through USPS at our check-out. Please note that selecting this Express Post option does not guarantee next day delivery.`,
        },
 
        {
            title: "DO YOU SHIP INTERNATIONALLY?",
            content: `We offer shipping of online purchases to India only at this time. At this time we do not ship outside the India due to additional taxes and fees imposed by customs. `,
        },
 
        {
            title: "WHAT HAPPENS IF MY PACKAGE GOES MISSING? ",
            content: `Unfortunately, we can not change any order information once your order has been processed. Please ensure the correct post codes are entered and if you are in an office building, please add your company name to avoid your package being sent back to us.  `,
        },
 
        {
            title: "WHAT HAPPENS IF I ENTERED THE WRONG DELIVERY INFORMATION?",
            content: `If your package has been 'stuck in transit' for longer than expected please let us know so we can lodge a 'missing package investigation' with parcel service. `,
        },
 
    
    ],

};

const styles = {
    // bgColor: 'white',
    titleTextColor: "black",
    rowTitleColor: "black",
    position:"relative",
    // rowContentColor: 'grey',
    // arrowColor: "red",
};

const config = {
     animate: true,
    // arrowIcon: "V",
    // tabFocus: true
    position:"relative",
    expandIcon: "+",
    collapseIcon: "-",
    transitionDuration: "1s",
};

export default function CartPageFaq(){

    return (
        <div className="faqParent fof text-4xl relative">
            <Faq
                data={data}
                styles={styles}
                config={config}
                className="relative"
            />
            
        </div>
        
    );
}