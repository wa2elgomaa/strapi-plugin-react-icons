/*
 *
 * HomePage
 *
 */

import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/strapi/admin';
import {
  Button,
  // IconButton,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Box,
  Flex,
  Tr,
  Td,
  Th,
  Typography,
  // VisuallyHidden,
} from '@strapi/design-system';
import { Layouts } from '@strapi/admin/strapi-admin';
import { Trash } from '@strapi/icons';
import { Navigate } from 'react-router-dom';
import * as ReactIcons from '../all';
import usePermissions from '../hooks/usePermissions';
import ReactIconsSelector from '../components/ReactIconsSelector';

const HomePage = () => {
  const { canRead, loading } = usePermissions();
  const { get, put, del, post } = useFetchClient();
  const [iconLibraries, setIconLibraries] = useState<IIconLibrary[]>([]);

  const getIconLibraries = async () => {
    setIconLibraries([...(await get('/icon-picker/iconlibrary/find')).data]);
  };

  const updateIconLibrary = async (id: string, isEnabled: boolean) => {
    await put(`/icon-picker/iconlibrary/update/${id}`, {
      data: { isEnabled: isEnabled },
    });
    setIconLibraries((current) => {
      return current.map((iconLibrary) =>
        iconLibrary.id === id
          ? {
              ...iconLibrary,
              isEnabled: isEnabled,
            }
          : iconLibrary
      );
    });
  };

  const deleteIconLibrary = async (id: string) => {
    await del(`/icon-picker/iconlibrary/delete/${id}`);
    setIconLibraries((current) => current.filter((iconLibrary) => iconLibrary.id !== id));
  };

  const importDefaultIconLibraries = async () => {
    (await import('../data/default.json')).default.forEach(async (entry: any) => {
      await post('/icon-picker/iconlibrary/post', {
        data: entry,
      });
    });

    getIconLibraries();
  };

  useEffect(() => {
    if (!canRead) return;

    getIconLibraries();
  }, [canRead]);

  const getIconCount = (abbreviation: string) => {
    return Object.keys(ReactIcons).filter((icon) => icon.toLowerCase().startsWith(abbreviation))
      .length;
  };

  if (loading) return null;

  if (!canRead) return <Navigate to="/" />;

  return (
    <Box
      background="neutral0"
      hasRadius={true}
      shadow="filterShadow"
      padding={8}
      style={{ marginTop: '10px' }}
    >
      <Layouts.Header
        title="icon-picker"
        subtitle="Select the icon-picker libraries you want to have enabled."
        // as="h2"
        primaryAction={
          <Button onClick={importDefaultIconLibraries}>Import default icon libraries</Button>
        }
      />
      {/* <ReactIconsSelector label={''} name="" required={true} options={[]} type="enumeration" /> */}
      <Layouts.Action
        startActions={
          <>
            <Button
              onClick={() =>
                iconLibraries
                  .filter((iconLibrary) => iconLibrary.isEnabled)
                  .forEach((iconLibrary) => updateIconLibrary(iconLibrary.id, false))
              }
              variant="secondary"
              // label="Disable all"
            >
              <Flex gap={5}>
                <Trash />
                Disable all
              </Flex>
            </Button>
            <Button
              onClick={() =>
                iconLibraries.forEach((iconLibrary) => deleteIconLibrary(iconLibrary.id))
              }
              variant="danger"
              // label="Delete all"
            >
              <Flex gap={5}>
                <Trash />
                Delete all
              </Flex>
            </Button>
          </>
        }
      />

      <Layouts.Content>
        <Table colCount={4} rowCount={iconLibraries.length}>
          <Thead>
            <Tr>
              <Th>
                <Typography variant="sigma">is enabled</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">abbreviation</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">name</Typography>
              </Th>
              <Th>
                <Typography variant="sigma">icon count</Typography>
              </Th>
              <Th>
                Actions
                {/* <VisuallyHidden>Actions</VisuallyHidden> */}
              </Th>
            </Tr>
          </Thead>

          <Tbody>
            {iconLibraries.length > 0 ? (
              iconLibraries
                .sort((a, b) => Number(b.isEnabled) - Number(a.isEnabled))
                .map((iconLibrary) => {
                  return (
                    <Tr key={iconLibrary.name}>
                      <Td>
                        <Checkbox
                          id={iconLibrary.id}
                          checked={iconLibrary.isEnabled}
                          onClick={() => updateIconLibrary(iconLibrary.id, !iconLibrary.isEnabled)}
                        />
                      </Td>

                      <Td>
                        <Typography textColor="neutral800">{iconLibrary.abbreviation}</Typography>
                      </Td>

                      <Td>
                        <Typography textColor="neutral800">{iconLibrary.name}</Typography>
                      </Td>

                      <Td>
                        <Typography textColor="neutral800">
                          {getIconCount(iconLibrary.abbreviation)}
                        </Typography>
                      </Td>

                      <Td>
                        <Button
                          onClick={() => deleteIconLibrary(iconLibrary.id)}
                          // label="Delete"
                          // icon={<Trash color="#fff" />}
                        >
                          Delete
                        </Button>
                      </Td>
                    </Tr>
                  );
                })
            ) : (
              <Box padding={5}>
                <Typography variant="pi">No icon libraries added yet</Typography>
              </Box>
            )}
          </Tbody>
        </Table>
      </Layouts.Content>
    </Box>
  );
};

export default HomePage;
