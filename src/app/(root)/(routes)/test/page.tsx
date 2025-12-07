import { UnderLineTab } from '@/components/atoms/UnderLineTab'
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/molecules/drawer'

export default function Page() {
  return (
    <div>
      <Drawer>
        <DrawerTrigger asChild>
          <div>open</div>
        </DrawerTrigger>
        <DrawerContent className="w-full rounded-t-2xl bg-white-color border-none mt-2 mb-4">
          <div className="bg-[#d9d9d9] rounded-full mx-auto h-[6px] w-10 shrink-0 mb-5" />
          <DrawerHeader>
            <UnderLineTab
              className="px-5"
              defaultValue="정렬1"
              tabs={[
                {
                  value: '정렬1',
                  label: '정렬1',
                },
                {
                  value: '정렬2',
                  label: '정렬2',
                },
                {
                  value: '정렬3',
                  label: '정렬3',
                },
              ]}
            />
            <DrawerTitle className="w-full text-left px-6 py-4 typo-body-2-2-sb text-grey-color-4 active:text-black active:bg-light-color-2 ">
              Test
            </DrawerTitle>
            <DrawerTitle className="w-full text-left px-6 py-4 typo-body-2-2-sb text-grey-color-4 active:text-black active:bg-light-color-2 ">
              Test
            </DrawerTitle>
            <DrawerTitle className="w-full text-left px-6 py-4 typo-body-2-2-sb text-grey-color-4 active:text-black active:bg-light-color-2 ">
              Test
            </DrawerTitle>
            <DrawerTitle className="w-full text-left px-6 py-4 typo-body-2-2-sb text-grey-color-4 active:text-black active:bg-light-color-2 ">
              Test
            </DrawerTitle>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
