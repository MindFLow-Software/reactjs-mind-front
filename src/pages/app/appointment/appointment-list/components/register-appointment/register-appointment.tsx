import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ptBR } from 'date-fns/locale'
import {
  CalendarIcon,
  Clock,
  FileText,
  Loader2,
  Stethoscope,
  User,
} from 'lucide-react'

import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
import { cn } from '@/lib/utils'
import { Time } from '@/utils/time'
import { AppointmentStatus } from '@/types/appointment/appointment-status'

import {
  createAppointmentSchema,
  type CreateAppointmentData,
} from '@/validators/appointments/form/create-appointment-schema'
import { usePatientLookup } from '../../hooks/use-patient-lookup'
import { useRegisterAppointment } from '../../hooks/use-register-appointment'

import './register-appointment.css'

const MAX_CONTENT_LENGTH = 200
const MAX_DIAGNOSIS_LENGTH = 90

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
    watch,
    formState: { isValid, errors },
  } = form

  const { mutateAsync: registerAppointmentFn, isPending } =
    useRegisterAppointment({ onSuccess })

  const contentLength = watch('content')?.length ?? 0

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
                      className={cn(
                        'ra-input w-full',
                        fieldState.invalid &&
                          'border-red-600 focus-visible:ring-red-600/20',
                      )}
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

          <FormField
            control={control}
            name="diagnosis"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="ra-field-label">
                  <Stethoscope className="h-4 w-4 text-muted-foreground" />
                  Tema da Sessão
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    id="diagnosis"
                    placeholder="ex: Ansiedade generalizada"
                    maxLength={MAX_DIAGNOSIS_LENGTH}
                    className={cn(
                      'ra-input',
                      fieldState.invalid &&
                        'border-red-600 focus-visible:ring-red-600/20',
                    )}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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
                    className="ra-input w-full justify-start font-normal bg-transparent cursor-pointer"
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
                    locale={ptBR}
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

          <FormField
            control={control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="ra-field-label">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  Notas{' '}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    id="content"
                    placeholder="Adicione observações relevantes..."
                    maxLength={MAX_CONTENT_LENGTH}
                    rows={3}
                    className="resize-none"
                  />
                </FormControl>
                <div className="ra-counter">
                  <span>
                    {contentLength}/{MAX_CONTENT_LENGTH}
                  </span>
                </div>
              </FormItem>
            )}
          />

          <div className="pt-3">
            <Button
              type="submit"
              className="ra-submit-btn"
              disabled={isPending || !isValid}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
