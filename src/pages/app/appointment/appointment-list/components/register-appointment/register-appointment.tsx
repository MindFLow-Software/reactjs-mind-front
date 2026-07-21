import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarIcon, Clock, Loader2, User } from 'lucide-react'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form'
import { TextInput } from '@/components/form-fields/text-input/text-input'
import { TextareaInput } from '@/components/form-fields/textarea-input/textarea-input'
import { Time } from '@/utils/time'
import { AppointmentStatus } from '@/types/appointment/appointment-status'

import {
  createAppointmentSchema,
  type CreateAppointmentData,
} from '@/validators/appointments/form/create-appointment-schema'
import { usePatientLookup } from '../../hooks/use-patient-lookup'
import { useRegisterAppointment } from '../../hooks/use-register-appointment'

import './register-appointment.css'

type IRegisterAppointment = {
  initialDate?: Date
  onSuccess?: () => void
}

function buildScheduledAt(date: Date | undefined, time: string): string {
  return Time.atTime(date, time)?.toISOString() ?? ''
}

function buildDefaultValues(initialDate?: Date): CreateAppointmentData {
  const time = Time.toHourMinute(initialDate)

  return {
    patientProfileId: '',
    diagnosis: '',
    content: '',
    scheduledAt: buildScheduledAt(initialDate, time),
    status: AppointmentStatus.SCHEDULED,
  }
}

export function RegisterAppointment({
  initialDate,
  onSuccess,
}: IRegisterAppointment) {
  const { patients, isLoading: isLoadingPatients } = usePatientLookup()

  const [pickerDate, setPickerDate] = useState<Date | undefined>(initialDate)
  const [pickerTime, setPickerTime] = useState(() =>
    Time.toHourMinute(initialDate),
  )

  const form = useForm<CreateAppointmentData>({
    resolver: zodResolver(createAppointmentSchema),
    mode: 'onTouched',
    defaultValues: buildDefaultValues(initialDate),
  })

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isValid, errors },
  } = form

  const { mutateAsync: registerAppointmentFn, isPending } =
    useRegisterAppointment({ onSuccess })

  function renderPatientOptions() {
    if (isLoadingPatients) {
      return (
        <div className="ra-select-state">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      )
    }

    if (patients.length === 0) {
      return (
        <div className="ra-select-empty">Nenhum paciente ativo encontrado</div>
      )
    }

    return patients.map((patient) => (
      <SelectItem
        key={patient.id}
        value={patient.id}
        className="cursor-pointer"
      >
        {patient.name}
      </SelectItem>
    ))
  }

  function handleDateSelect(selectedDate: Date | undefined) {
    setPickerDate(selectedDate)
    setValue('scheduledAt', buildScheduledAt(selectedDate, pickerTime), {
      shouldValidate: true,
    })
  }

  function handleTimeChange(newTime: string) {
    setPickerTime(newTime)
    setValue('scheduledAt', buildScheduledAt(pickerDate, newTime), {
      shouldValidate: true,
    })
  }

  async function onSubmit(data: CreateAppointmentData) {
    await registerAppointmentFn(data)
  }

  return (
    <DialogContent className="ra-dialog">
      <DialogHeader className="flex flex-col gap-1.5">
        <DialogTitle className="text-xl font-semibold">
          Novo Agendamento
        </DialogTitle>
        <DialogDescription className="text-muted-foreground">
          Preencha as informações abaixo para criar um novo agendamento
        </DialogDescription>
      </DialogHeader>

      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="ra-form">
          <FormField
            control={control}
            name="patientProfileId"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="ra-field-label">
                  <User className="h-4 w-4 text-muted-foreground" />
                  Paciente
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="patientProfileId"
                      aria-invalid={fieldState.invalid}
                      className="ra-input w-full"
                    >
                      <SelectValue
                        placeholder={
                          isLoadingPatients
                            ? 'Carregando...'
                            : 'Selecione o paciente'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-[280px]">
                      <SelectGroup>{renderPatientOptions()}</SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <TextInput<CreateAppointmentData>
            name="diagnosis"
            label="Tema da Sessão"
            placeholder="ex: Ansiedade generalizada"
          />

          <div className="ra-grid-2">
            <FormItem>
              <FormLabel className="ra-field-label">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                Data
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="ra-input w-full cursor-pointer justify-start bg-transparent font-normal"
                  >
                    {pickerDate ? (
                      Time.toDayLongMonthYear(pickerDate)
                    ) : (
                      <span>Selecione a data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={pickerDate}
                    onSelect={handleDateSelect}
                    disabled={(day) => day < Time.now()}
                    locale={Time.locale}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormItem>

            <FormItem>
              <FormLabel className="ra-field-label">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Horário
              </FormLabel>
              <Input
                id="time"
                type="time"
                value={pickerTime}
                onChange={(e) => handleTimeChange(e.target.value)}
                className="ra-input cursor-pointer"
              />
            </FormItem>
            {errors.scheduledAt && (
              <p className="ra-field-error col-span-2">
                {errors.scheduledAt.message}
              </p>
            )}
          </div>

          <TextareaInput<CreateAppointmentData>
            name="content"
            label="Notas (opcional)"
            placeholder="Adicione observações relevantes..."
            rows={3}
          />

          <div className="pt-3">
            <Button
              type="submit"
              className="ra-submit-btn"
              disabled={isPending || !isValid}
            >
              {isPending ? (
                <>
                  <Loader2 data-icon="inline-start" className="animate-spin" />
                  Criando agendamento...
                </>
              ) : (
                'Criar Agendamento'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </DialogContent>
  )
}
