import { Form } from '@inertiajs/react';
import { useLingui } from '@lingui/react';
import { useRef } from 'react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DeleteUser() {
    const { i18n } = useLingui();
    const passwordInput = useRef<HTMLInputElement>(null);

    return (
        <div className="space-y-6">
            <Heading
                variant="small"
                title={i18n._('settings.deleteAccount.title')}
                description={i18n._('settings.deleteAccount.description')}
            />
            <div className="space-y-4 rounded-lg border border-red-100 bg-red-50 p-4 dark:border-red-200/10 dark:bg-red-700/10">
                <div className="relative space-y-0.5 text-red-600 dark:text-red-100">
                    <p className="font-medium">
                        {i18n._('settings.deleteAccount.warning')}
                    </p>
                    <p className="text-sm">
                        {i18n._('settings.deleteAccount.warningDescription')}
                    </p>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            variant="destructive"
                            data-test="delete-user-button"
                        >
                            {i18n._('settings.deleteAccount.deleteButton')}
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle>
                            {i18n._(
                                'settings.deleteAccount.confirmDialog.title',
                            )}
                        </DialogTitle>
                        <DialogDescription>
                            {i18n._(
                                'settings.deleteAccount.confirmDialog.description',
                            )}
                        </DialogDescription>

                        <Form
                            {...ProfileController.destroy.form()}
                            options={{
                                preserveScroll: true,
                            }}
                            onError={() => passwordInput.current?.focus()}
                            resetOnSuccess
                            className="space-y-6"
                        >
                            {({ resetAndClearErrors, processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label
                                            htmlFor="password"
                                            className="sr-only"
                                        >
                                            {i18n._(
                                                'settings.deleteAccount.confirmDialog.passwordLabel',
                                            )}
                                        </Label>

                                        <PasswordInput
                                            id="password"
                                            name="password"
                                            ref={passwordInput}
                                            placeholder={i18n._(
                                                'settings.deleteAccount.confirmDialog.passwordPlaceholder',
                                            )}
                                            autoComplete="current-password"
                                        />

                                        <InputError message={errors.password} />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                onClick={() =>
                                                    resetAndClearErrors()
                                                }
                                            >
                                                {i18n._(
                                                    'settings.deleteAccount.confirmDialog.cancel',
                                                )}
                                            </Button>
                                        </DialogClose>

                                        <Button
                                            variant="destructive"
                                            disabled={processing}
                                            asChild
                                        >
                                            <button
                                                type="submit"
                                                data-test="confirm-delete-user-button"
                                            >
                                                {i18n._(
                                                    'settings.deleteAccount.confirmDialog.confirm',
                                                )}
                                            </button>
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
