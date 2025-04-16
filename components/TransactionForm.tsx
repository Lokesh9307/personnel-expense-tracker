"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Transaction } from "@/lib/types";

// Schema with string inputs (as entered in the form)
const rawFormSchema = z.object({
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Amount must be a valid number",
    }),
  description: z.string().min(1, "Description is required"),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
});

type RawFormValues = z.infer<typeof rawFormSchema>;

interface TransactionFormProps {
  onSubmit: (transaction: Transaction) => void;
  initialData?: Transaction;
}

export default function TransactionForm({
  onSubmit,
  initialData,
}: TransactionFormProps) {
  const form = useForm<RawFormValues>({
    resolver: zodResolver(rawFormSchema),
    defaultValues: {
      amount: initialData ? String(initialData.amount) : "",
      description: initialData?.description || "",
      date: initialData?.date
        ? new Date(initialData.date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        amount: String(initialData.amount),
        description: initialData.description,
        date: initialData.date
          ? new Date(initialData.date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    }
  }, [initialData, form]);

  const handleSubmit = (values: RawFormValues) => {
    const transformed: Transaction = {
      id: initialData?.id || "",
      amount: Number(values.amount),
      description: values.description,
      date: new Date(values.date),
    };

    onSubmit(transformed);

    if (!initialData) {
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          {initialData ? "Update Transaction" : "Add Transaction"}
        </Button>
      </form>
    </Form>
  );
}
