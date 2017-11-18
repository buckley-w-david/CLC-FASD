from django.contrib.auth.models import User
from django import forms


class UserForm(forms.ModelForm):
    password = forms.CharField(widget = forms.PasswordInput)

    class Meta:
        model = User
        fields = ['username','email','password']

    def save(self, commit = True):
        user = super(UserForm, self).save(commit = False)
        user.email = self.cleaned_data['email']

        if commit:
            user.save()

        return user
    
