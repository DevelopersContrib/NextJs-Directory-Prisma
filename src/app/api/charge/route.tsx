//https://sultanoveli.medium.com/how-to-add-stripe-payments-to-your-next-js-app-d1cfced7c8a5
import { NextResponse, NextRequest } from 'next/server';
import Stripe from 'stripe';
import { getServerSession } from 'next-auth/next';
import { authOptions } from "@/lib/utils/auth-options";
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
  typescript: true,
});

export const POST = async (req: Request) => {
  try {
    const session = await getServerSession(authOptions);

    const data = await req.json();
    const amount = Math.round(data.pack_price);

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: 'USD',
      });

      const data = {
        email: session?.user?.email,
        amount: amount,
        price: amount,
        client_secret: paymentIntent.client_secret,
        return_url: process.env.BASE_URL + '/pricing',
      };

      // call payment api...
      const apiUrl = process.env.API_URL + '/payment/charge?api_key=' + process.env.API_KEY;

      const res = await axios.post(apiUrl, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + session?.token,
        },
      });

      return NextResponse.json(res.data, { status: 200 });
    } catch (error: any) {
      console.log(error);
      return new NextResponse(error, {
        status: 400,
      });
    }
  } catch (error) {
    console.log(error);
  }
};