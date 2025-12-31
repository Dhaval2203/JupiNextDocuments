import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import {
    accentColor,
    primaryColor,
    secondaryColor,
    whiteColor,
} from "../../../Utils/Colors";

export async function POST(req) {
    try {
        const formData = await req.formData();

        const file = formData.get("file");
        const monthYear = formData.get("monthYear");
        const employeeRaw = formData.get("employee");

        if (!file || !employeeRaw || !monthYear) {
            return NextResponse.json(
                { error: "Missing required data" },
                { status: 400 }
            );
        }

        /* --------------------------------
           Employee comes from SalarySlip
        -------------------------------- */
        const employee = JSON.parse(employeeRaw);

        const toEmail = employee.primaryEmail;

        const ccEmails = [
            employee.secondaryEmail,
            "parekhdhaval1998@gmail.com",
        ].filter(Boolean);

        /* --------------------------------
           Convert file → buffer
        -------------------------------- */
        const buffer = Buffer.from(await file.arrayBuffer());

        /* --------------------------------
           Mail Transport
        -------------------------------- */
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.NEXT_PUBLIC_EMAIL_USER,
                pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
            },
        });

        /* --------------------------------
           Send Email (TEMPLATE UNCHANGED)
        -------------------------------- */
        await transporter.sendMail({
            from: `"Payroll Team - JupiNext" <${process.env.NEXT_PUBLIC_EMAIL_USER}>`,
            to: toEmail,
            cc: ccEmails,
            subject: `Salary Slip | ${employee.employeeName} | ${monthYear.replace("_", " ")}`,
            html: `
<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#F8FAFC;padding:24px;font-family:Arial,sans-serif;">
<tr>
<td align="center">
<table width="600" cellpadding="0" cellspacing="0"
    style="background:${whiteColor};border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(0,0,0,0.08);">

<!-- Header -->
<tr>
<td style="background:${primaryColor};padding:20px 24px;">
    <h2 style="margin:0;color:${whiteColor};font-size:22px;">
        Salary Slip
    </h2>
    <p style="margin:4px 0 0;color:#E5E7EB;font-size:14px;">
        ${monthYear.replace("_", " ")}
    </p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:24px;color:#111827;font-size:14px;line-height:1.6;">

<p style="margin-top:0;">
Dear <strong style="color:${primaryColor};">
${employee.employeeName}
</strong>,
</p>

<p>
Please find attached your <strong>salary slip</strong> for the month of
<strong style="color:${secondaryColor};">
${monthYear.replace("_", " ")}
</strong>.
</p>

<!-- Employee Info -->
<table width="100%" cellpadding="0" cellspacing="0"
    style="background:#F1F5F9;border-left:4px solid ${primaryColor};margin:20px 0;">
<tr>
<td style="padding:12px 16px;font-size:13px;color:#1F2937;">
<strong>Employee ID:</strong> ${employee.employeeId}<br/>
<strong>Designation:</strong> ${employee.designation}<br/>
<strong>Department:</strong> ${employee.department}
</td>
</tr>
</table>

<p>
This document includes a detailed breakdown of earnings, deductions,
and net pay for the mentioned period.
</p>

<p>
If you have any questions or notice any discrepancies,
please contact the HR or Payroll team.
</p>

<p style="margin-bottom:0;">
Best regards,<br/>
<strong style="color:${primaryColor};">Payroll Team</strong>
</p>

<div style="margin-top:16px;font-weight:700;font-size:15px;">
<span style="color:${primaryColor};">Jupi</span>
<span style="color:${secondaryColor};">Next</span>
</div>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#F9FAFB;padding:14px 24px;text-align:center;font-size:12px;color:#6B7280;">
This is an automated email. Please do not reply.
</td>
</tr>

</table>
</td>
</tr>
</table>
            `,
            attachments: [
                {
                    filename: file.name,
                    content: buffer,
                    contentType: "application/pdf",
                },
            ],
        });

        return NextResponse.json({
            message: "Email sent successfully",
        });

    } catch (error) {
        console.error("EMAIL ERROR:", error);
        return NextResponse.json(
            { error: "Failed to send email" },
            { status: 500 }
        );
    }
}
