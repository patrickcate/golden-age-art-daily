import DetailsList from '@components/details-list.vue'

describe('DetailsList Component', () => {
  let wrapper
  let options

  beforeEach(() => {
    options = {
      propsData: {
        id: '01-01',
      },
    }

    wrapper = createWrapper(DetailsList, options)
  })

  it('is a Vue instance', () => {
    expect(wrapper.exists()).toBeTruthy()
  })

  it('renders correctly', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('does not render correctly', () => {
    const wrapper = createWrapper(
      DetailsList,
      {
        ...options,
      },
      {
        getters: {
          getArtworkById: () => () => {
            return null
          },
        },
      }
    )

    expect(wrapper).toMatchSnapshot()
  })
})
