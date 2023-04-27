export function Filterer(key = 'originalParams') {
  return function filterParams(
    target: any,
    propertyKey: string,
    index: number,
  ) {
    const originalMethod = target[propertyKey]
    target[propertyKey] = function (...args: any[]) {
      const originalParams = args[index]
      console.log(args, index)

      if (originalParams && Object.keys(originalParams).length > 0) {
        const sorterKeys = ['sort', 'order']
        const pagerKeys = ['page', 'pageSize']
        const conditions = {}
        const sorter = {}
        const pager = {}
        Object.keys(originalParams).forEach((key) => {
          if (sorterKeys.includes(key)) {
            sorter[key] = originalParams[key]
          } else if (pagerKeys.includes(key)) {
            pager[key] = originalParams[key]
          } else {
            conditions[key] = originalParams[key]
          }
        })
        args[index] = {
          conditions,
          sorter,
          pager,
          originalParams: {
            ...originalParams,
          },
        }
      }

      return args[index][key]
    }
  }
}

// export function Filterer(target: any, propertyKey: string, index: number) {
//   const originalMethod = target[propertyKey]
//   target[propertyKey] = function (...args: any[]) {
//     const originalParams = args[index]
//     console.log(args, index)

//     if (originalParams && Object.keys(originalParams).length > 0) {
//       const sorterKeys = ['sort', 'order']
//       const pagerKeys = ['page', 'pageSize']
//       const conditions = {}
//       const sorter = {}
//       const pager = {}
//       Object.keys(originalParams).forEach((key) => {
//         if (sorterKeys.includes(key)) {
//           sorter[key] = originalParams[key]
//         } else if (pagerKeys.includes(key)) {
//           pager[key] = originalParams[key]
//         } else {
//           conditions[key] = originalParams[key]
//         }
//       })
//       args[index] = {
//         conditions,
//         sorter,
//         pager,
//         originalParams: {
//           ...originalParams,
//         },
//       }
//     }

//     return originalMethod.apply(this, args)
//   }
// }
