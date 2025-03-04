import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  RadioButton,
  Select,
} from "~/Components";
import { validEmail } from "~/Forms/util";
import { KEY } from "~/i18n/constants";
import styles from "./BuyTicketModal.module.scss";
import type { EventDto } from "~/dto";
import { TextItem } from "~/constants";
import { useTextItem } from "~/hooks";

// Validation schema
const buyTicketFormSchema = z
  .object({
    tickets: z.number().min(0),
    membershipTickets: z.number().min(0),
    membershipNumber: z.string().optional(),
    email: z.string().refine(validEmail, { message: "Invalid email format" }).optional(),
  })
  .refine((data) => data.email || data.membershipNumber, {
    message: "You must provide either an email or a membership number",
    path: ["email"],
  });

type BuyTicketFormType = z.infer<typeof buyTicketFormSchema>;

interface BuyTicketFormProps {
  initialData?: Partial<BuyTicketFormType>;
  event: EventDto;
}

export function BuyTicketForm({ event }: BuyTicketFormProps) {
  const { t } = useTranslation();
  const [totalPrice, setTotalPrice] = useState(0);
  const [ticketType, setTicketType] = useState("membershipNumber");
  const [ticketTypeEmail, setTicketTypeEmail] = useState<boolean>(false);

  const form = useForm<BuyTicketFormType>({
    resolver: zodResolver(buyTicketFormSchema),
    defaultValues: {
      tickets: 0,
      membershipTickets: 0,
      membershipNumber: "",
      email: "",
    },
  });

  const PostTicketForm = (data: BuyTicketFormType) => {
    console.log("Submitted Ticket Form Data:", data);
  };
  

  const price = event?.price ?? 50;
  const price_member = event?.price_member ?? 30;
  


  const tickets = useWatch({ control: form.control, name: "tickets" });
  const membershipTickets = useWatch({ control: form.control, name: "membershipTickets" });
  
  useEffect(() => {
    setTotalPrice(tickets * price + membershipTickets * price_member);
  }, [tickets, membershipTickets, price, price_member]);

  // useEffect(() => {
  //   if (ticketType === "email") {
  //     form.setValue("email", "");
  //   } else if (ticketType === "membershipNumber") {
  //     form.setValue("membershipNumber", "");
  //   }
  // }, [ticketType]);

  return (
    <div className={styles.container}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(PostTicketForm)}>
          {/* Ticket Selection */}
          <div className={styles.ticket_selection}>
            {/* Non-Member Tickets */}
            <FormField
              control={form.control}
              name="tickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${t(KEY.common_not)}-${t(KEY.common_member)}`}</FormLabel>
                  <FormControl>
                  <Select
                    {...field}
                    options={[...Array(9).keys()].map((num) => ({ label: `${num}`, value: num.toString() }))} // Convert value to string
                    onChange={(e) => {
                      if (e) {
                        form.setValue("tickets", Number(e.target.value)); // Convert string back to number
                      }
                    }}
                    value={field.value.toString()} // Ensure value is a string
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Member Tickets */}
            <FormField
              control={form.control}
              name="membershipTickets"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t(KEY.common_member)}</FormLabel>
                  <FormControl>
                  <Select
                    {...field}
                    options={[...Array(9).keys()].map((num) => ({ label: `${num}`, value: num.toString() }))} // Convert value to string
                    onChange={(e) => {
                      if (e) {
                        form.setValue("membershipTickets", Number(e.target.value)); // Convert string back to number
                      }
                    }}
                    value={field.value.toString()} // Ensure value is a string
                  />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Email / Membership Number Toggle */}
          <div className={styles.ticket_type}>
            <div className={styles.ticket_type_fields}>
              <div className={styles.ticket_type_field}>
                <div className={styles.radio_box}>
                  <RadioButton
                    name="ticketType"
                    // onChange={() => form.setValue("ticketType", "membershipNumber")}
                    onChange={() => { setTicketType("membershipNumber"); setTicketTypeEmail(false); }}
                    defaultChecked={true}
                  />{" "}
                  <label>{t(KEY.common_membership_number)}</label>
                </div>
                {/* Membership Number Field */}
                <FormField
                  control={form.control}
                  name="membershipNumber"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>{t(KEY.common_membership_number)}</FormLabel> */}
                      <FormControl>
                        <Input 
                          type="text" 
                          className={styles.membership_number_field}
                          disabled={ticketTypeEmail}
                          style={{
                            backgroundColor: ticketTypeEmail ? "lightgray" : "white",
                          }} 
                          placeholder="Enter membership number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className={styles.ticket_type_field}>
                <div className={styles.radio_box}>
                  <RadioButton
                    name="ticketType"
                    // onChange={() => form.setValue("ticketType", "email")}
                    onChange={() => {setTicketType("email"); setTicketTypeEmail(true); }}
                  />{" "}
                  <label className={styles.email_label}>{t(KEY.common_email)}</label>
                </div>
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className={styles.email_field}>
                      {/* <FormLabel>{t(KEY.common_email)}</FormLabel> */}
                      <FormControl>
                        <Input 
                          type="email"
                          disabled={!ticketTypeEmail}
                          style={{
                            backgroundColor: ticketTypeEmail ? "white" : "lightgray",
                          }} 
                          placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="ticket_type_description">
              <p style={{display: ticketTypeEmail ? "none" : "inline"}}>
                {useTextItem(TextItem.ticketless_description)}
              </p>
              <p style={{display: ticketTypeEmail ? "inline" : "none"}}>
                Billetten(e) blir sendt på epost, og må vises fram i døren når du kommer til Samfundet. Billettene kan 
                vises på mobil eller tas med som utskrift.
              </p>
            </div>
          </div>

          {/* Total Price */}
          <div className={styles.total_price}>
            <strong>{t(KEY.common_total)}: {totalPrice} NOK</strong>
          </div>

          {/* Submit Button */}
          <Button type="submit" className={styles.pay_button}>
          {t(KEY.common_to_payment)}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default BuyTicketForm;
