<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    protected $fillable = ['user_id', 'account_number', 'balance', 'currency'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function outgoingTransactions()
    {
        return $this->hasMany(Transaction::class, 'from_account_id');
    }

    public function incomingTransactions()
    {
        return $this->hasMany(Transaction::class, 'to_account_id');
    }
}
