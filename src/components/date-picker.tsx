"use client"

import { format } from "date-fns";

import { cn } from "@/lib/utils";

import {
   Popover,
   PopoverTrigger,
   PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";

interface DatePickerProps {
   value: Date | undefined;
   onChange: (date: Date) => void;
   className?: string;
   placeholder?: string;
};

export const DatePicker = ({
   value,
   onChange,
   className,
   placeholder,
}: DatePickerProps) => {
   return (
      <Popover>
         <PopoverTrigger asChild>
            <Button
               size="lg"
               variant="outline"
               className={cn(
                  "w-full justify-start text-left font-normal px-3",
                  !value && "text-muted-foreground",
                  className,
               )}
            >
               <CalendarIcon className="mr-2 size-4" />
               {value ? format(value, "PPP") : <span>{placeholder}</span>}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="p-0 w-auto">
            <Calendar
               mode="single"
               selected={value}
               onSelect={(date) => onChange(date as Date)}
               initialFocus
            />
         </PopoverContent>
      </Popover>
   )
};