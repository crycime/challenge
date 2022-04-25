export const mockModelMethod = (mockResponseFunc: () => Promise<any>) => {
  const modelMethod = () => ({
    populate: modelMethod,
    lean: mockResponseFunc,
    execPopulate: mockResponseFunc
  })
  return modelMethod
}
