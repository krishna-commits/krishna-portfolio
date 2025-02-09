
import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';
import MessageUsEmail from './email-template';

const resend = new Resend('re_C9BeaK7X_2dTLr4b1juLDDgtbPpq6XqcN');

export async function POST(req: NextRequest) {
  const { name, email, message, phone, country, company } = await req.json();

  try {
    const data = await resend.emails.send({
      from: `${name} <portfolio@neupanekrishna.com.np>`, // your verified domain
      to: ['neupanekrishna33@gmail.com'],  // the email address you want to send a message
      subject: `${name} has a message!`,
      react: MessageUsEmail({ name, email, message, phone, country, company }),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}

// import EmailTemplate from "./email-template";
// import { Resend } from 'resend';
// import * as React from 'react';

// import { NextRequest, NextResponse } from 'next/server';

// const RESEND_API_KEY = 're_B7eZCsU2_LNyKtoguuC4aMK8VUXCeTEtx';
// const resend = new Resend(RESEND_API_KEY);

// export async function POST(req: NextRequest) {
//   const { name, email, message } = await req.json();

//   try {
//     const data = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>', // your verified domain
//       to: ['dev.sanjeebkc@gmail.com'], // the email address you want to send a message
//       subject: `${name} has a message!`,
//       react: EmailTemplate({ name, email, message }),
//     });

//     return NextResponse.json(data);
//   } catch (error) {
//     return NextResponse.json({ error });
//   }

// }




  // try {
  //   const { data, error } = await resend.emails.send({
  //     from: 'Acme <onboarding@resend.dev>',
  //     to: ['dev.sanjeebkc@gmail.com'],
  //     subject: formData.subject || "Default Subject",
  //     react: EmailTemplate({ 
  //       name: formData.name,
  //       company :formData.company, 
  //       email:formData.email, 
  //       country: formData.country, 
  //       phoneNumber: formData.phoneNumber,
  //       message: formData.message, 
  //     }) as React.ReactElement,
  //   });
  //   console.log('formData', formData)
  //   console.log('data', data)
    
  //   if (error) {
  //     return Response.json({ error });
  //   }

  //   return Response.json({ data });
  // } catch (error) {
  //   return Response.json({ error });
  // }