import puppeteer from "puppeteer";
import fs from "fs";
import Appointment from "../Model/appointmentModel.js";
import userDetailsModel from "../Model/userDetailsModel.js";
import User from "../Model/UserModel.js";
import Prescription from "../Model/Prescription.js";
import moment from "moment-timezone";
export const generatePrescriptinById = async (req, res) => {
  const { id } = req.params;

  const prescription = await Prescription.findById(id);
  const appoint = await Appointment.findById(prescription.appointmentId);
  const user = await User.findById(appoint.doctor);
  const franchise = await User.findById(appoint.expert);
  const extraDetails = await userDetailsModel.findOne({
    userId: appoint.doctor,
  });

  const invoiceHTML = `
    <html>

        <head>
            <style>
                .header {
                    display: flex;
                    justify-content: space-between;
                    padding: 10px 10px 0 10px;
                    margin-bottom: 10px;
                    background-color: #d8fcdd;
                    background: #d8fcdd;
                }
                .footer {
                    background-color: #d8fcdd;
                    padding: 10px 10px 10px 10px;
                    margin-top: 20px;
                }
                
                html {
                -webkit-print-color-adjust: exact;
                }
                  
            </style>
        </head>

        <body>
            <div class="header" >
                <img src="https://fever99.com/clinic_logo.png" height="80" style="margin-top: 5px" />
                <img src="https://fever99.com/plus.png" height="100" style="margin-top: 5px" />
                <div style="text-align: right; line-height: 0.40; margin-right: 35px">
                    <p style="font-size: 22px; font-weight: bold;">${
                      user && user.name
                    }</p>
                    <p >${extraDetails ? extraDetails.degree : ""}</p>
                    <p >${user && user.specialization}</p>                    
                    <p>Reg. No : ${
                      extraDetails ? extraDetails.registrationNumber : ""
                    }</p>
                    <p>City : ${user && user.city}</p>
                </div>
            </div>

            <div style="display: flex;">
                <div style="width: 25%; border-right: 1px solid gray;">
                    <b style="line-height: 0.8px">Available Specialty</b>
                    <p style="line-height: 0.8px">General Physician</p>
                                           
                    <p style="line-height: 0.8px">Specialty</p>
                    <ul> 
                        <li>General Medicine</li>
                        <li>General Surgery</li>
                        <li>Gynaecology </li>
                        <li>Paediatrics </li>
                        <li>Orthopaedics</li>
                        <li>Dermatology </li>
                        <li>Pulmonology</li>
                        <li>Psychiatry </li>
                        <li>ENT</li>
                        <li>Ophthalmology </li>
                        <li>Emergency Medicine</li>
                        <li>Diabetology</li>
                    </ul>
                    <p style="line-height: 0.8px">Super specialty</p>
                    <ul>
                        <li>Cardiology</li>
                        <li>Cardiac Surgery</li>
                        <li>Nephrology</li>
                        <li>Urology</li>
                        <li>Gastroenterology </li>
                        <li>GI Surgery </li>
                        <li>Neurology </li>
                        <li>Neurosurgery </li>
                        <li>Neonatology</li>
                        <li>Endocrinology </li>
                        <li>Rheumatology </li>
                        <li>Oncology </li>
                        <li>Onco Surgery</li>
                        <li>Haematology </li>
                    </ul>
                    <p style="line-height: 0.8px">Others</p>
                    <ul>
                        
                        <li>Dentistry</li>
                        <li>Physiotherapy</li>
                        <li>Dietetics</li>
                        <li>Clinical Nutrition </li>
                        <li>Psychology</li>
                        <li>Homeopathy</li>
                        <li>Ayurveda</li>
                        <li>Unani</li>
                        <li>Electrohomeopathy</li>
                        <li>Sexology</li>
                    </ul>
                </div>
                <div style="width: 65%; padding-left: 30px;">
                    <div style=" display: flex; justify-content: space-between; margin-top: -10px">
                        <div style="border-right: 1px solid gray; width: 49%;">
                            <p><b>${appoint && appoint.patientName}</b> | ${appoint && appoint.age} YEARS | ${ appoint && appoint.gender }</p>                            
                        </div>
                        <div>
                            <p>${
                              appoint &&
                              moment(prescription.createdAt).tz('Asia/Kolkata').format(
                                "DD-MMM-YYYY h:mm A"
                              )
                            }</p>
                        </div>
                    </div>
                    ${
                      appoint
                        ? `
                        <div>
                            
                            <table border="4" style="border: none; width: 100%">
                                <tr>
                                  <td>BP: ${
                                    appoint.bp ? `${appoint.bp} mm of Hg` : ""
                                  }</td>
                                  <td>Pulse: ${
                                    appoint.pulse
                                      ? `${appoint.pulse} Per min`
                                      : ""
                                  }</td>
                                  <td>Temp: ${
                                    appoint.bodyTemperature
                                      ? `${appoint.bodyTemperature} ℉`
                                      : ""
                                  }</td>
                                  <td>SpO<sub>2</sub>: ${
                                    appoint.oxigne ? `${appoint.oxigne} %` : ""
                                  }</td>
                                </tr>
                                <tr>
                                  <td>FBS: ${
                                    appoint.suger1
                                      ? `${appoint.suger1} mg/dL`
                                      : ""
                                  }</td>
                                  <td>PPBS: ${
                                    appoint.suger2
                                      ? `${appoint.suger2} mg/dL`
                                      : ""
                                  }</td>
                                  <td>RBS: ${
                                    appoint.suger3
                                      ? `${appoint.suger3} mg/dL`
                                      : ""
                                  }</td>
                                  <td>RR: ${
                                    appoint.respiratoryRate
                                      ? `${appoint.respiratoryRate} Per min`
                                      : ""
                                  }</td>
                                </tr>
                              </table>

                        </div>
                    `
                        : ""
                    }

                    ${
                      prescription && prescription.symptoms
                        ? `
                        <div style="border-bottom: 1px solid gray;">
                            <p><b>Symptoms: </b> ${prescription && prescription.symptoms}</p>
                            
                        </div>
                    `
                        : ""
                    }

                    ${
                      prescription && prescription.drugAllergy
                        ? `
                        <div style="border-bottom: 1px solid gray; ">
                            <p><b >H/o Drug Allergy:</b> ${prescription && prescription.drugAllergy}</p>
                            
                        </div>
                    `
                        : ""
                    }
                    

                    ${
                      prescription && prescription.pastHistory
                        ? `
                        <div style="border-bottom: 1px solid gray; ">
                            <p><b >Past History: </b>${prescription && prescription.pastHistory}</p>
                            
                        </div>
                    `
                        : ""
                    }
                    
                    
                    
                    ${
                      prescription && prescription.personalHistory
                        ? `
                        <div style="border-bottom: 1px solid gray; ">
                            <p><b >Personal History: </b>${prescription && prescription.personalHistory}</p>
                            
                        </div>
                        `
                        : ""
                    }
                    

                    ${
                      prescription && prescription.surgicalHistory
                        ? `
                            <div style="border-bottom: 1px solid gray; ">
                               <p> <b>Surgical History: </b>${ prescription && prescription.surgicalHistory}</p>
                                
                            </div>
                        `
                        : ""
                    }
                    
                    ${
                      prescription && prescription.diagnosis
                        ? `
                        <div style="border-bottom: 1px solid gray; ">
                            <p><b >Diagnosis:</b>${prescription && prescription.diagnosis}</p>
                            
                        </div>
                        `
                        : ""
                    }
                    


                    <div>
                        <b>Rx..(Medicine)</b>
                        <table style="width:100%; border:1px solid #a3a3c2; font-size:12px;">
                        ${
                          prescription &&
                          prescription.medicine &&
                          prescription.medicine
                            .map(
                              (item, index) =>
                                
                                // `<div style="margin-top: 10px; line-height: 0.6px">` +
                                // `<p>${index + 1}. <b>${item.name}</b> - ${ item.note } - ${item.frequency} - ${item.duration} </p>` +
                                `<tr> <td style="width:auto; padding:5px 0;border:1px solid #a3a3c2;">${index + 1}. <b>${item.name??''}</b></td> <td style="width:auto; padding:5px 0;border:1px solid #a3a3c2;">${ item.note??'' } ${ item.dose_form??'' }</td> <td style="width:auto; padding:5px 0;border:1px solid #a3a3c2;"> <p style="border: 1px solid #a3a3c2; text-align:center;  margin-bottom: -1px;">${item.frequency??''}</p> <div style="display: flex; justify-content: space-between;"><span style="border: 1px solid #a3a3c2;">${item.roa??''}</span><span style="border: 1px solid #a3a3c2;">${item.time??''}</span></div></td><td style="width:auto; padding:5px 0;border:1px solid #a3a3c2;">${item.duration_count??''} ${item.duration??''}</td> </tr>`
                                // `</div>`
                                )
                            .join("")
                        }
                        </table>
                    </div>

                    ${
                      prescription && prescription.investigation
                        ? `
                        <div style="border-bottom: 1px solid gray; ">                            
                            <p><b>Investigation: </b> ${ prescription && prescription.investigation}</p>
                        </div>

                        `
                        : ""
                    }                    
                    

                    ${
                      prescription && prescription.notes
                        ? `<div style="">
                           <p> <b >Notes:</b> ${prescription && prescription.notes}</p>
                            
                        </div>`
                        : ""
                    }
                    
                </div>
            </div>
            <div class="footer">
                <p style="text-align: center; ">
                    Address:  ${
                      franchise && franchise.address !== ""
                        ? franchise.address
                        : `Fever99 E-clinic, Shriram Complex, Near SPR Society, Sector 82, Faridabad, Haryana Website: www.fever99.com`
                    }
                    
                </p>
                <p style="text-align: center;">For any help please contact 6262-8080-62</p>
            </div>
        </body>

    </html>
  `;
  // const browser = await puppeteer.launch();
  const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome' })
  const page = await browser.newPage();

  // Set the HTML content of the page
  await page.setContent(invoiceHTML);

  // Generate the PDF
  const pdfBuffer = await page.pdf({ format: "A4" });

  // Close the browser
  await browser.close();

  // Set the response header to indicate a PDF file
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="prescription.pdf"'
  );

  // Send the PDF as the response
  res.send(pdfBuffer);
};
