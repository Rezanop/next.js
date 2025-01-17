/* eslint-env jest */

import fs from 'fs-extra'
import { join } from 'path'
import { nextBuild } from 'next-test-utils'

const appDir = join(__dirname, '../app')

describe('build trace with extra entries', () => {
  it('should build and trace correctly', async () => {
    const result = await nextBuild(appDir, undefined, {
      cwd: appDir,
      stderr: true,
      stdout: true,
    })
    console.log(result)
    expect(result.code).toBe(0)

    const appTrace = await fs.readJSON(
      join(appDir, '.next/server/pages/_app.js.nft.json')
    )
    const indexTrace = await fs.readJSON(
      join(appDir, '.next/server/pages/index.js.nft.json')
    )
    const anotherTrace = await fs.readJSON(
      join(appDir, '.next/server/pages/another.js.nft.json')
    )
    const imageTrace = await fs.readJSON(
      join(appDir, '.next/server/pages/image-import.js.nft.json')
    )

    expect(appTrace.files.some((file) => file.endsWith('hello.json'))).toBe(
      true
    )
    expect(
      appTrace.files.some((file) => file.endsWith('lib/get-data.js'))
    ).toBe(true)
    expect(
      indexTrace.files.some((file) => file.endsWith('hello.json'))
    ).toBeFalsy()
    expect(
      indexTrace.files.some((file) => file.includes('some-cms/index.js'))
    ).toBe(true)

    expect(
      anotherTrace.files.some((file) =>
        file.includes('nested-structure/constants/package.json')
      )
    ).toBe(true)
    expect(
      anotherTrace.files.some((file) =>
        file.includes('nested-structure/package.json')
      )
    ).toBe(true)
    expect(
      anotherTrace.files.some((file) =>
        file.includes('nested-structure/dist/constants.js')
      )
    ).toBe(true)
    expect(
      imageTrace.files.some((file) => file.includes('public/another.jpg'))
    ).toBe(true)
    expect(
      imageTrace.files.some((file) => file.includes('public/test.jpg'))
    ).toBe(false)
  })
})
