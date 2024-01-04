import { DateTime } from 'luxon'
import { Value } from '../reducers/templateSlice'

export type OnlineAppointmentData = {
    id: string,
    date: string,
    beneficiaryId: string,
    phoneNumber: string,
    hasInsurance: boolean,
    medicId: string,
    isTransferred: boolean,
    consultancyDate: string,
    isStarted: boolean,
    isEnded: boolean,
}

export type AmbulanceCallData = {
    id: string,
    beneficiaryId: string,
    insuranceId?: string,
    city: string,
    address: string,
    addressDetails?: string,
    phoneNumber: string,
    callReason: string,
    medicId?: string,
    diagnosis?: string,
    comment?: string,
    transferred: boolean,
    served: boolean,
    emergency: boolean,
    hospitalized: boolean,
    createdDate?: DateTime,
    createdBy?: string,
    modifiedDate?: DateTime,
    modifiedBy?: string,
}

export type HospitalizationData = {
    id: string
    beneficiaryId: string
    branchId: string
    hospitalizationDate: DateTime,
    whoHospitalized: string,
    hospitalizationType: string,
    medCompany: string,
    financingType: string,
    diagnosis: string,
    isDiagnosisApproved: boolean,
    medicId: string,
    escort: boolean,
    lastActiveDate: DateTime,
    writingOutDate: DateTime
}

export type MedCardData = {
    id: string
    beneficiaryId: string
    date: string
    appointments: MedCardAppointment
}

export type MedCardAppointment = {
    medicId?: string
    primaryAppointmentId?: string
    serviceId?: string
    provided: boolean
    diagnoseId: string
    diagnoseConfirmed: boolean
    diagnose1Id: string
    comment: string
    purpose: Purpose
    repeat: boolean
    mainServiceId: string
    serviceAmount: number
    status: Status
    price: number
    symptoms: string[]
    anamnesis: string
    chronicIllnesses: string
    checking: { [key: string]: string | string[] }
    procedures: string[]
    medicines: string[]
    conclusion: string
    sickLeave?: { id: string, start: DateTime, end: DateTime, action: number }
    files: string[]
}

type Purpose =
    | 'заболевание'
    | 'профилактика'
    | 'беременность'
    | 'новорожденный'
    | 'диспансер'
    | 'направление'

type Status =
    | 'на повторный прием'
    | 'на обследование'
    | 'на госпитализацию'
    | 'на актив'
    | 'без изменения'
    | 'выздоровление'

export type SpecialtyData = { id: string, name: string }

export type BranchData = { id: string, name: string }

export type MedCompanyData = { id: string, name: string }
export type DiagnosisData = { id: string, name: string }
export type DiseaseData = { code: string, name: string }
export type DiseaseGroupData = { code: string, name: string, diseases: DiseaseData[], downloaded: boolean }
export type ServiceData = { id: string, code: string, name: string, externalCode: string }
export type ServiceGroupData = { id: string, name: string, services: ServiceData[] }

export type FavoritesData = {
    medicId: string,
    favoriteDiagnoses: DiseaseData[],
    favoriteServices: ServiceData[],
    favoriteMedicines: [{ id: string, name: string }],
}

type FieldData = {
    name: string,
} & ({
    type: 'select',
    selectValues: string[],
    mutable?: boolean,
} | {
    type: 'multipleSelect',
    selectValues: string[],
} | {
    type: 'template',
    template: string,
} | {
    type: 'text'
} | {
    type: 'textarea'
} | {
    type: 'tag-select',
    selectValues: string[],
    multiple: boolean,
} | {
    type: 'function',
    f: string[]
} | {
    type: 'table',
    columns: Array<{
        name: string,
        fields: FieldData[]
    }>
} | {
    type: 'complexTable',
    rows: Array<Array<{field: FieldData, rowSpan?: number, colSpan?: number, isHeader?: boolean}>>
} | {
    type: 'date'
} | {
    type: 'diseaseWithText'
})

export type ExaminationData = {
    id: string
    medicId: string
    beneficiaryId: string
    templateId: string
    date: DateTime
    examinationType: string
    groups: { name: string, values: Value[] }[]
}

export type FieldTemplatesData = { templateId: string, templates: { [group: string]: { [field: string]: Array<{ name: string, value: string }> } } }
export type CreateFieldTemplatesData = {
    medicId: string
    templateId: string
    field: string
    group: string
    name: string
    value: string
}

export type DeleteFieldTemplatesData = {
    medicId: string
    templateId: string
    group: string
    field: string
    name: string
}

export type TemplateData = {
    id: string,
    specialtyId: string,
    name: string,
    groups: Array<{
        name: string,
        fields: Array<FieldData>
    }>,
    templateType: string
}

export type TemplateSampleData = {
    id: string,
    name: string,
    medicId: string,
    templateId: string,
    groups: Array<{
        name: string,
        value: string
    }>
}

export type MedicData = {
    id: string
    iin: string
    name: string
    isMale: boolean
    isResident: boolean
    documentType: string
    documentNumber: string
    homePhoneNumber: string
    workPhoneNumber: string
    mobilePhoneNumber: string
    address: string
    email: string
    typeOfEmployment: string
    dateOfBirth: DateTime
    position: string
    specialties: Array<string>
    typeOfWork: string[]
    branchId: string
    startDate: DateTime
    endDate?: DateTime
}

export type MedicVisitData = {
    id: string
    medicId: string
    beneficiaryId: string
    templateId: string
    name: string
    date: DateTime
    observationType: string
    groups: {name: string, values: Value[]}[]
    isSickLeaveActive: boolean,
    firstSickLeavePeriod: { active: boolean, firstMedicId: string | null, secondMedicId?: string | null, startDate: DateTime | null, endDate: DateTime | null} | null,
    secondSickLeavePeriod?: { active: boolean, firstMedicId: string | null, secondMedicId?: string | null, startDate: DateTime | null, endDate: DateTime | null} | null,
    thirdSickLeavePeriod?: { active: boolean, firstMedicId: string | null, secondMedicId: string | null, startDate: DateTime | null, endDate: DateTime | null} | null,
    fourthSickLeavePeriod?: { active: boolean, firstMedicId: string | null, secondMedicId: string | null, startDate: DateTime | null, endDate: DateTime | null} | null,
    sickLeaveBackToWork : DateTime | nullsss
}

export type CalendarData = {
    medicId: string,
    branchId: string,
    freeCalendarWindows: {
        [date: string]: Array<{
            startTime: string,
            endTime: string,
        }>
    }
}

export type UpdateScheduleOverviewData = {
    medicId: string,
    branchScheduleId: string,
    isShowing: boolean,
    minimalAppointmentDuration: number,
    workingSchedule: {
        days: {
            [day: string]: Array<{
                startTime: string,
                endTime: string,
            }> | undefined
        }
    }
}

export type ScheduleOverviewResponse = {
    id: string,
    medicId: string,
    branchSchedules: {
        id: string,
        branchId: string,
        isShowing: boolean,
        startDate: number[],
        endDate?: number[],
        workingSchedule: {
            days: {
                [day: string]: Array<{
                    startTime: string,
                    endTime: string,
                }>
            }
        },
        minimalAppointmentDuration: number,
        specialDays: {
            [date: string]: Array<{
                startTime: string,
                endTime: string,
            }>
        },
        timeOffs: {
            [date: string]: Array<{
                startTime: string,
                endTime: string,
            }>
        }
        holidays: Array<{startDate: number[], endDate: number[]}>
    }[]
}

export type ScheduleOverviewData = {
    id: string,
    medicId: string,
    branchSchedules: {
        id: string
        branchId: string,
        isShowing: boolean,
        startDate: DateTime,
        endDate?: DateTime,
        workingSchedule: {
            days: {
                [day: string]: Array<{
                    startTime: string,
                    endTime: string,
                }>
            }
        },
        minimalAppointmentDuration: number,
        specialDays: {
            [date: string]: Array<{
                startTime: string,
                endTime: string,
            }>
        },
        timeOffs: {
            [date: string]: Array<{
                startTime: string,
                endTime: string,
            }>
        }
        holidays: Array<{startDate: DateTime, endDate: DateTime}>
    }[]
}

export type ScheduleData = {
    medicId: string,
    workingHours: {
        [day: string]: [{
            startTime: string,
            endTime: string,
        }]
    }
}

export type AppointmentData = {
    id: string,
    medicId: string,
    beneficiaryId: string,
    insuranceId?: string,
    branchId: string,
    type: string,
    phoneNumber: string,
    startDate: DateTime,
    endDate: DateTime,
    comment: string,
    isOnline: boolean,
    vip?: boolean,
    status: 'ACTIVE' | 'COMPLETED'
    createdBy: string,
    createdDate: DateTime,
    modifiedBy: string,
    modifiedDate: DateTime,
}

export type AppointmentCreationData = {
    medicId: string,
    beneficiaryId: string,
    insuranceId?: string,
    branchId: string,
    startDate: DateTime,
    endDate: DateTime,
    type: string,
    phoneNumber: string,
    comment: string,
    isOnline: boolean,
    vip: boolean,
}

export type BeneficiarySearchData = {
    id: string,
    name: string,
    iin: string,
    insurances?: InsuranceData[]
}

export type CoordinatorData = {
    id: string,
    username: string,
    firstName: string,
    lastName: string
}

export type BeneficiaryResponse = {
    id: string,
    insuranceId: string,
    name: string,
    iin?: string,
    isMale?: boolean,
    phoneNumber?: string,
    address?: string,
    addressDetails?: string,
    birthDate?: number[],
    insurances?: InsuranceResponse[]
}

export type InsuranceResponse = {
    id: string,
    cardNumber: string,
    startDate: number[],
    endDate: number[],
    customerName: string
}

export type BeneficiaryData = {
    id: string,
    insuranceId: string,
    name: string,
    iin?: string,
    isMale?: boolean,
    phoneNumber?: string,
    address?: string,
    addressDetails?: string,
    birthDate?: DateTime,
    insurances?: InsuranceData[]
}

export type InsuranceData = {
    id: string,
    cardNumber: string,
    startDate: DateTime,
    endDate: DateTime,
    customerName: string
}

export type DocumentTemplate = {
    id: string,
    name: string,
    reference: string,
    groups: Array<{
        name: string,
        fields: Array<FieldData>
    }>
}

export type DocumentData = {
    id: string,
    documentTypeId: string,
    number?: number,
    medicId: string,
    medicVisitId: string,
    beneficiaryId: string,
    createdAt: DateTime,
    createdBy: string,
    modifiedAt: DateTime,
    modifiedBy: string,
    data: {
        type: string
        groups: Array<{name: string, values: Value[]}>
        any
    }
}