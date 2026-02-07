export interface JobItem {
  id: number
  name: string
  engName: string
}

export interface JobsPayload {
  jobs: JobItem[]
}
