export function usePatientNavigation(currentId: string, patientIds: string[]) {
  const currentIndex = patientIds.indexOf(currentId)
  
  const prevId = currentIndex > 0 ? patientIds[currentIndex - 1] : null
  const nextId = currentIndex < patientIds.length - 1 ? patientIds[currentIndex + 1] : null

  return { prevId, nextId, currentNumber: currentIndex + 1, total: patientIds.length }
}