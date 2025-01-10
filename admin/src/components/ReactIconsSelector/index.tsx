import React, { ReactNode, useEffect, useState } from 'react';
import {
  Accordion,
  Badge,
  Box,
  Button,
  // FieldAction,
  Flex,
  Modal,
  // Searchbar,
  // SearchForm,
  SingleSelect as Select,
  SingleSelectOption as Option,
  TextInput,
  Typography,
  Grid,
  Field,
  useComposedRefs,
} from '@strapi/design-system';
import { useField, type InputProps } from '@strapi/strapi/admin';
import * as ReactIcons from '../../all';
import { MessageDescriptor, useIntl } from 'react-intl';
import { useFetchClient } from '@strapi/strapi/admin';
import getTrad from '../../utils/getTrad';
import { IconLibraryComponent } from './IconLibraryComponent';
import { IconComponent } from './IconComponent';
import { Minus, Plus, Search, Cross } from '@strapi/icons';

type IconPickerProps = InputProps & {
  labelAction?: React.ReactNode;
};

export type IReactIcon = keyof typeof ReactIcons;

const ReactIconsSelector = ({
  hint,
  disabled,
  labelAction,
  label,
  name,
  required,
  ...props
}: InputProps & IconPickerProps) => {
  // const {
  //   // description, error, label,labelAction, placeholder, name, required, onChange, value
  //   hint, disabled, labelAction, label, name, required, ...props
  // } = props || {};
  console.log('props ==>', props);
  const { formatMessage } = useIntl();
  const { get } = useFetchClient();
  const iconPickerButtonRef = React.useRef<HTMLButtonElement>(null!);

  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);
  const [selectedIconLibrary, setSelectedIconLibrary] = useState<string | null>(null);
  const allReactIcons = Object.keys(ReactIcons) as IReactIcon[];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const field = useField(name);
  const selectedIcon = field.value ?? '';

  const toggleModal = () => setIsModalVisible((prev) => !prev);

  const changeIcon = (newIcon: string) => field.onChange(name, newIcon);

  const onSelectIcon = (newIcon: string) => {
    toggleModal();
    changeIcon(newIcon);
  };

  useEffect(() => {
    const getIconLibraries = async () => {
      setIconLibraries(
        (await get('/icon-picker/iconlibrary/find')).data.filter(
          (iconLibrary: IIconLibrary) => iconLibrary.isEnabled
        )
      );
    };

    getIconLibraries();
  }, []);

  const [expandedIDs, setExpandedID] = useState<string[]>([]);
  const handleToggle = (id: string) => () => {
    expandedIDs?.includes(id)
      ? setExpandedID(expandedIDs.filter((i) => i !== id))
      : setExpandedID([...expandedIDs, id]);
  };

  const handleExpand = () => {
    if (iconLibraries.length === expandedIDs.length) {
      setExpandedID([]);
    } else {
      setExpandedID(iconLibraries.map((iconLibrary, index) => 'acc-' + index));
    }
  };

  const renderModal = () => {
    return (
      <Modal.Root defaultOpen={isModalVisible} open={isModalVisible} onOpenChange={setIsModalVisible}>
        <Modal.Trigger style={{ padding: '3px' }}>
          <Search width={30} height={30} style={{ cursor: 'pointer' }} />
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Typography fontWeight="bold" id="title">
              Select icon
            </Typography>
          </Modal.Header>
          <Modal.Body>
            <Box>
              {/* <SearchForm> */}
              <Flex gap={2}>
                <Box key={1}>
                  <TextInput
                    onReset={() => setSearchTerm('')}
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setSearchTerm(e.target.value)
                    }
                    placeholder={formatMessage({
                      id: getTrad('iconSelector.search'),
                    })}
                  />
                </Box>
                <Box key={2}>
                  {iconLibraries.length === expandedIDs.length ? (
                    <Button size="L" onClick={handleExpand} startIcon={<Minus />}>
                      Collapse
                    </Button>
                  ) : (
                    <Button size="L" onClick={handleExpand} startIcon={<Plus />}>
                      Expand
                    </Button>
                  )}
                </Box>
              </Flex>
              {/* </SearchForm> */}

              {iconLibraries.length > 0 ? (
                <Box padding={4} marginTop={2} background="neutral0">
                  <Accordion.Root collapsible>
                    {iconLibraries
                      .filter(
                        (iconLibrary) =>
                          !selectedIconLibrary || iconLibrary.abbreviation === selectedIconLibrary
                      )
                      .map(
                        (iconLibrary, index) =>
                          allReactIcons.filter(
                            (icon) =>
                              icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                              icon.toLowerCase().includes(searchTerm.toLowerCase())
                          ).length > 0 && (
                            <Accordion.Item
                              value={'acc-' + index}
                              // expanded={expandedIDs.includes('acc-' + index)}
                              onToggle={handleToggle('acc-' + index)}
                              id={'acc-' + index}
                              // size="S"
                            >
                              <Accordion.Header>
                                <Accordion.Trigger
                                  caretPosition="left"
                                  // icon={User}
                                >
                                  <Flex justifyContent={'space-between'}>
                                    <Typography>{`${iconLibrary.name} (${iconLibrary.abbreviation})`}</Typography>
                                  </Flex>
                                </Accordion.Trigger>
                                <Accordion.Actions>
                                  <Badge>
                                    {
                                      allReactIcons.filter(
                                        (icon) =>
                                          icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                                          icon.toLowerCase().includes(searchTerm.toLowerCase())
                                      ).length
                                    }
                                  </Badge>
                                </Accordion.Actions>
                              </Accordion.Header>
                              <Accordion.Content>
                                <Box paddingLeft={3} paddingTop={3} paddingBottom={3}>
                                  <Flex
                                    direction="row"
                                    wrap="wrap"
                                    display="flex"
                                    alignItems="center"
                                    gap={1}
                                  >
                                    <IconLibraryComponent
                                      icons={allReactIcons.filter(
                                        (icon) =>
                                          icon.toLowerCase().startsWith(iconLibrary.abbreviation) &&
                                          icon.toLowerCase().includes(searchTerm.toLowerCase())
                                      )}
                                      onSelectIcon={onSelectIcon}
                                    />
                                  </Flex>
                                </Box>
                              </Accordion.Content>
                            </Accordion.Item>
                          )
                      )}
                  </Accordion.Root>
                </Box>
              ) : (
                <Typography variant="pi">
                  {formatMessage({
                    id: getTrad('iconSelector.noIconLibrariesAvailable'),
                  })}
                </Typography>
              )}
            </Box>
          </Modal.Body>
          <Modal.Footer>
            <Select
              required={false}
              value={selectedIconLibrary}
              onChange={(value) => setSelectedIconLibrary(String(value))}
            >
              <Option value="">
                {formatMessage({ id: getTrad('iconSelector.allIconLibraries') })}
              </Option>

              {iconLibraries.map((iconLibrary) => (
                <Option key={iconLibrary.id} value={iconLibrary.abbreviation}>
                  {iconLibrary.name}
                </Option>
              ))}
            </Select>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    );
  };
  return (
    <>
      <Field.Root name={name} id={name} error={field.error} required={required}>
        <Flex direction="column" alignItems="stretch" gap={1}>
          <Field.Label action={labelAction}>{label as ReactNode}</Field.Label>
          <Field.Input
            {...props}
            value={selectedIcon}
            aria-label={formatMessage({
              id: getTrad('color-picker.input.aria-label'),
              defaultMessage: 'Color picker input',
            })}
            // style={{ textTransform: 'uppercase' }}
            name={name}
            onChange={field.onChange}
            startAction={renderModal()}
          />
          <Field.Hint />
          <Field.Error />
        </Flex>
      </Field.Root>
    </>
  );
};

export default ReactIconsSelector;
